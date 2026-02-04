const BaseRepository = require("../base.repository");
const Order = require("../../models/product/order.model");
const Product = require("../../models/product/product.model");
const Inventory = require("../../models/product/inventory.model");
const { STOCK_STATUS, ORDER_STATUS, PAYMENT_STATUS } = require("../../constants/enums");
const customError = require("../../utils/error");

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }


  checkProductExistWithQuantity = async (products, session) => {
    const ids = products.map((p) => p.product);

    const dbProducts = await Product.find({ _id: { $in: ids } })
      .populate([{ path: "inventory", select: "_id quantity status" }, {path: "category"}])
      .session(session);

    if (dbProducts.length !== products.length) {
      throw customError("Some products not found, please refresh cart", 400);
    }

    const finalProductData = [];
    for (const item of products) {
      const product = dbProducts.find(
        (p) => String(p._id) === String(item.product)
      );

      if (!product.status) {
        throw customError(
          `${product.name} is not available, please remove it`,
          400
        );
      }

      if (String(product.inventory.status) !== String(STOCK_STATUS.IN_STOCK)) {
        throw customError(`${product.name} is out of stock`, 400);
      }

      if (product.inventory.quantity < item.quantity) {
        throw customError(
          `${product.name} has only ${product.inventory.quantity} left, please reduce quantity`,
          400
        );
      }

      finalProductData.push({
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        sellingPrice: product.sellingPrice,
        category: product.category._id
      });
    }

    return finalProductData;
  };

 
  updateProductInventory = async (
    products,
    session,
    direction = "decrease"
  ) => {
    const bulkOps = products.map((item) => {
      const qtyChange =
        direction === "decrease" ? -item.quantity : item.quantity;

      return {
        updateOne: {
          filter: { product: item.product },
          update: [
            {
              $set: {
                quantity: { $add: ["$quantity", qtyChange] },
                salesCount: {
                $add: [
                  "$salesCount",
                  direction === "decrease" ? item.quantity : 0,
                ],
              },
              },
            },
            {
              $set: {
                status: {
                  $cond: [
                    { $lte: [{ $add: ["$quantity", qtyChange] }, 0] },
                    STOCK_STATUS.OUT_OF_STOCK,
                    STOCK_STATUS.IN_STOCK,
                  ],
                },
              },
            },
          ],
        },
      };
    });

    const result = await Inventory.bulkWrite(bulkOps, { session });
    if (!result) throw customError("Failed to update inventory", 500);
    return result;
  };

  getOrdersCount = async (startDate, endDate = new Date(), session = null) => {
    const filter = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  

  getDeliveredOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: "delivered",
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getArrivedOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: { $in: [ORDER_STATUS.SHIPPED] },
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getPendingOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: {
        $in: [
          ORDER_STATUS.PENDING,
          ORDER_STATUS.PROCESSING,
          ORDER_STATUS.SHIPPED,
        ],
      },
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getCancelledOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: { $in: [ORDER_STATUS.CANCELLED] },
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getTotalRevenue = async (startDate, endDate = new Date(), session = null) => {
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          orderStatus: { $nin: [ORDER_STATUS.CANCELLED] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ];

    const query = this.model.aggregate(pipeline);
    if (session) query.session(session);

    const result = await query;
    return result.length > 0 ? result[0].totalRevenue : 0;
  };


getWeeklyOrderCount = async (customStartDate) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); 
    
    
    const startDate = customStartDate || new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000));
    startDate.setHours(0, 0, 0, 0); 
    
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: today }
        }
      },
      {
        $addFields: {

          daysAgo: {
            $floor: {
              $divide: [
                { $subtract: [today, "$createdAt"] },
                86400000 
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: {
            daysAgo: "$daysAgo",
            dayOfWeek: { $dayOfWeek: "$createdAt" },
            dayName: {
              $switch: {
                branches: [
                  { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] }, then: "Sunday" },
                  { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] }, then: "Monday" },
                  { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] }, then: "Tuesday" },
                  { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] }, then: "Wednesday" },
                  { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] }, then: "Thursday" },
                  { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] }, then: "Friday" },
                  { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] }, then: "Saturday" }
                ],
                default: "Unknown"
              }
            },
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            }
          },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.daysAgo": 1 } 
      },
      {
        $project: {
          _id: 0,
          daysAgo: "$_id.daysAgo",
          dayOfWeek: "$_id.dayOfWeek",
          dayName: "$_id.dayName",
          date: "$_id.date",
          totalOrders: 1
        }
      }
    ];

    const result = await Order.aggregate(pipeline);

    
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayOfWeek = currentDate.getDay() + 1; 
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = dayNames[currentDate.getDay()];
      const dateString = currentDate.toISOString().split('T')[0];
      
      const matchingData = result.find(item => item.daysAgo === i);
      
      weekData.push({
        daysAgo: i,
        dayOfWeek: dayOfWeek,
        dayName: dayName,
        date: dateString,
        totalOrders: matchingData ? matchingData.totalOrders : 0,
        isToday: i === 0
      });
    }

    return weekData;
    
  } catch (error) {
    throw new Error(`Error getting weekly order count: ${error.message}`);
  }
};

findByPaymentIntentId = async (paymentIntentId) => {
    try {
        const order = await Order.findOne({ 
            'payment.paymentIntentId': paymentIntentId 
        });
        return order;
    } catch (error) {
        throw error;
    }
};

getOrderCountWithSaleCount = async (monthNumber, session, year = null) => {
  try {
  
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
      throw new Error(`Invalid month number provided: ${monthNumber}. Must be between 1-12`);
    }
    
    const currentYear = year || new Date().getFullYear();
    const monthIndex = monthNumber - 1; 
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = monthNames[monthIndex];
   
    const startDate = new Date(currentYear, monthIndex, 1);
    const endDate = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);
    
    const weeks = await this.getWeekBoundaries(startDate, endDate);
    
    const result = {
      monthNumber: monthNumber,
      monthName: monthName,
      year: currentYear,
      weeks: [],
      sales: [], 
      orders: [], 
      total: 0 
    };
    

    for (let i = 0; i < weeks.length; i++) {
      const weekStart = weeks[i].start;
      const weekEnd = weeks[i].end;

      const weeklyData = await Order.aggregate([
        {
          $match: {

            createdAt: {
              $gte: weekStart,
              $lte: weekEnd
            },

          }
        },
        {
          $group: {
            _id: null,
            totalSales: { 
              $sum: "$totalPrice" 
            },
            orderCount: { $sum: 1 }
          }
        }
      ]).session(session);


      
      const weekData = weeklyData[0] || { totalSales: 0, orderCount: 0 };
      
      result.weeks.push({
        weekNumber: i + 1,
        start: weekStart,
        end: weekEnd,
        sales: Math.ceil(weekData.totalSales),
        orders: weekData.orderCount
      });
      
      result.sales.push(Math.ceil(weekData.totalSales));
      result.orders.push(weekData.orderCount);
      result.total += weekData.totalSales;
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in getOrderCountWithSaleCount:', error);
    throw error;
  }
};


getWeekBoundaries = (startDate, endDate) => {
  const weeks = [];
  let currentWeekStart = new Date(startDate);
  
  while (currentWeekStart <= endDate) {
    let currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    

    if (currentWeekEnd > endDate) {
      currentWeekEnd = new Date(endDate);
    }
    
    weeks.push({
      start: new Date(currentWeekStart),
      end: new Date(currentWeekEnd.getFullYear(), currentWeekEnd.getMonth(), currentWeekEnd.getDate(), 23, 59, 59, 999)
    });
    
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  
  return weeks;
};


handleRequiresPaymentMethod = async (paymentIntent) => {
    
        
        const order = await Order.findOne({ 
            'payment.paymentIntentId': paymentIntent.id 
        });
        
        if (!order) {
            throw customError("Order not found", 404);
        }

        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PENDING,
            
        });

        return {
            order: updatedOrder,
            paymentStatus: 'requires_payment_method',
            message: 'Payment method required. Please complete the payment.'
        };
    
};

handleRequiresConfirmation = async (paymentIntent) => {
   
        const order = await Order.findOne({ 
            'payment.paymentIntentId': paymentIntent.id 
        });
        
        if (!order) {
            throw customError("Order not found", 404);
        }
        
        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PENDING,
           
        });

        return {
            order: updatedOrder,
            paymentStatus: 'requires_confirmation',
            message: 'Payment requires confirmation.'
        };
    
};

handleRequiresAction = async (paymentIntent) => {
    
        const order = await Order.findOne({ 
            'payment.paymentIntentId': paymentIntent.id 
        });
        
        if (!order) {
            throw customError("Order not found", 404);
        }
        
        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PENDING,
            
        });

        return {
            order: updatedOrder,
            paymentStatus: 'requires_action',
            message: 'Payment requires additional action (like 3D Secure).',
            nextAction: paymentIntent.next_action
        };
    
};

handleProcessing = async (paymentIntent) => {
    
        const order = await Order.findOne({ 
            'payment.paymentIntentId': paymentIntent.id 
        });
        
        if (!order) {
            throw customError("Order not found", 404);
        }
        
        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PROCESSING,
           
        });

        return {
            order: updatedOrder,
            paymentStatus: 'processing',
            message: 'Payment is being processed.'
        };
    
};

handleRequiresCapture = async (paymentIntent) => {
    
        const order = await Order.findOne({ 
            'payment.paymentIntentId': paymentIntent.id 
        });
        
        if (!order) {
            throw customError("Order not found", 404);
        }
        
        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PROCESSING,
            
        });

        return {
            order: updatedOrder,
            paymentStatus: 'requires_capture',
            message: 'Payment authorized, awaiting capture.'
        };
   
};

  
}

const orderRepository = new OrderRepository();

module.exports = orderRepository;
