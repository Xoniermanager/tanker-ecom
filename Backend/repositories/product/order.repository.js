const BaseRepository = require("../base.repository");
const Order = require("../../models/product/order.model");
const Product = require("../../models/product/product.model");
const Inventory = require("../../models/product/inventory.model");
const { STOCK_STATUS, ORDER_STATUS } = require("../../constants/enums");
const customError = require("../../utils/error");

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  /**
   * Validate that all products in the order exist, are in stock,
   * and have sufficient quantity available.
   *
   * @param {Array} products - Array of products from cart/order.
   *   Each item should include:
   *     - {ObjectId} product - Product ID
   *     - {Number} quantity - Desired quantity
   * @param {Object} session - Mongoose session for transaction safety
   *
   * @throws {Error} If:
   *   - Any product is not found in the database
   *   - Product is unavailable (status = false)
   *   - Product inventory status is not "IN_STOCK"
   *   - Requested quantity exceeds available stock
   *
   * @returns {Array} finalProductData - Array of validated product data:
   *   [
   *     {
   *       product: ObjectId,
   *       name: String,
   *       quantity: Number,
   *       sellingPrice: Number
   *     }
   *   ]
   */
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

  /**
   * Updates product inventory in bulk for a given list of products.
   *
   * This function performs a bulk write operation to adjust the quantity of each product.
   * It also updates the inventory status based on the resulting quantity:
   * - If quantity <= 0 → status is set to `OUT_OF_STOCK`
   * - If quantity > 0 → status is set to `IN_STOCK`
   *
   * Can handle both decreasing (after an order) or increasing (e.g., order cancellation) stock.
   *
   * @param {Array<Object>} products - Array of products to update. Each object should contain:
   *   @property {ObjectId} product - The product ID.
   *   @property {number} quantity - The amount to increase or decrease.
   * @param {Object} session - Optional Mongoose session for transaction support.
   * @param {string} [direction="decrease"] - Operation type: `"decrease"` to reduce stock, `"increase"` to restore stock.
   *
   * @returns {Promise<boolean>} Returns true if inventory was successfully updated.
   */
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
    today.setHours(23, 59, 59, 999); // End of today
    
    // Calculate start date (7 days ago from today)
    const startDate = customStartDate || new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000));
    startDate.setHours(0, 0, 0, 0); // Start of that day
    
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: today }
        }
      },
      {
        $addFields: {
          // Calculate days ago from today (0 = today, 1 = yesterday, etc.)
          daysAgo: {
            $floor: {
              $divide: [
                { $subtract: [today, "$createdAt"] },
                86400000 // milliseconds in a day
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
        $sort: { "_id.daysAgo": 1 } // Sort by days ago (oldest first, today last)
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

    // Create a complete 7-day array starting from 6 days ago to today
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayOfWeek = currentDate.getDay() + 1; // Convert to MongoDB format (1=Sunday, 7=Saturday)
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = dayNames[currentDate.getDay()];
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Find matching data from aggregation result
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


  
}

const orderRepository = new OrderRepository();

module.exports = orderRepository;
