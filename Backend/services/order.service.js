const { startSession } = require("mongoose");
const orderRepository = require("../repositories/product/order.repository");
const userRepository = require("../repositories/user.repository");
const customError = require("../utils/error");
const productRepository = require("../repositories/product/product.repository");
const {
  ORDER_STATUS,
  PAYMENT_STATUS,
  USER_ROLES,
  PAYMENT_METHODS,
} = require("../constants/enums");
const inventoryRepository = require("../repositories/product/inventory.repository");
const cartRepository = require("../repositories/cart.repository");
const { generateOrderNumber } = require("../utils/order-number");
const stripeService = require("./stripe.service");
const productCategoryRepository = require("../repositories/product/product-category.repository");
const { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } = require("../utils/email");

class OrderService {
  
  createOrder = async (payload) => {
    const session = await startSession();
    try {
      session.startTransaction();

      // Validate all products and stock
      const products = await orderRepository.checkProductExistWithQuantity(
        payload.products,
        session
      );

      payload.product = products;
      payload.payment = {
        method: payload.paymentMethod,
        status: PAYMENT_STATUS.PENDING,
      };
      payload.stockReduced = true;
      // payload.salesCount = payload.products.quantity,
      payload.orderNumber = generateOrderNumber();
      delete payload.paymentMethod;

     const result = await orderRepository.create(payload, session);
     if((payload.address.shippingAddress.country !== "NZ") && (payload.address.billingAddress.country !== "NZ") && (payload.payment.method === PAYMENT_METHODS.COD)){
       await sendOrderConfirmationEmail(result);
       await sendAdminOrderNotificationEmail(result)
     }

      await cartRepository.clearCart(payload.user._id, session);

      await orderRepository.updateProductInventory(payload.products, session);
      await productCategoryRepository.manageCategorySalesMetrics(products, session)

      await session.commitTransaction();
      return result;
    } catch (error) {
      console.log("error", error);

      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };

  
  getOrders = async (page = 1, limit = 10, filters = {}) => {
    const query = {};

    // Filter by user
    if (filters.userId) {
      query.user = filters.userId;
    }

    // Filter by status
    if (filters.status) {
      query.orderStatus = filters.status;
    }

    if (filters.paymentMethod) {
  query["payment.method"] = filters.paymentMethod;
}
    // Filter by date range
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (filters.sortBy) {
      const sortField = filters.sortBy;
      const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
      sort = { [sortField]: sortOrder };
    }
    console.log("query objs: ", query)
    return await orderRepository.paginate(query, page, limit, sort, null, null, "products.product");
  };

  
  getOrderById = async (orderId, user) => {
    const filters = { _id: orderId };
    if (user.role !== USER_ROLES.ADMIN) filters.user = user._id;

    const order = await orderRepository.findOne(filters);
    if (!order) throw customError("Order not found", 404);
    return order;
  };


  getOrderByOrderNumber = async (orderNumber, user) => {
    const filters = { orderNumber: orderNumber };
    if (user.role !== USER_ROLES.ADMIN) filters.user = user._id;

    const order = await orderRepository.findOne(filters);
    if (!order) throw customError("Order not found", 404);
    return order;
  };

  
  cancelOrder = async (orderId, user, reason = null) => {
    const session = await startSession();

    try {
      session.startTransaction();

      const role = user.role;
      const userId = user._id;

      const order = await orderRepository.findById(orderId, session);
      if (!order) {
        throw customError("Order not found", 404);
      }

      
      if (
        role !== USER_ROLES.ADMIN &&
        order.user._id.toString() !== userId.toString()
      ) {
        throw customError("Not authorized to cancel this order", 403);
      }

      
      if (![ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING].includes(
          order.orderStatus
        )
      ) {
        throw customError("Order cannot be cancelled at this stage", 400);
      }

      
      order.orderStatus = ORDER_STATUS.CANCELLED;

     
      order.statusHistory.push({
        status: ORDER_STATUS.CANCELLED,
        changedAt: new Date(),
        note:
          "Order cancelled by " +
          (role === USER_ROLES.ADMIN ? "admin" : "user"),
        reason
      });

      await order.save({ session });
      
      if (order.stockReduced) {
        await orderRepository.updateProductInventory(
          order.products,
          session,
          "increase"
        );
      

        // await productCategoryRepository.manageCategorySalesMetrics(order.products, session, "decrease")
      }

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };

 
  changeOrderStatus = async (orderId, newStatus, note = "", adminUser) => {
    const session = await startSession();

    try {
      session.startTransaction();

      const order = await orderRepository.findById(orderId, session);
      if (!order) {
        throw customError("Order not found", 404);
      }


      if (!Object.values(ORDER_STATUS).includes(newStatus)) {
        throw customError("Invalid order status", 400);
      }

      // Prevent setting same status
      if (order.orderStatus === newStatus) {
        throw customError(`Order already has status "${newStatus}"`, 400);
      }

      // Prevent changing status of a cancelled order
      if (order.orderStatus === ORDER_STATUS.CANCELLED) {
        throw customError("Cannot change status of a cancelled order", 400);
      }

      // Update order status
      order.orderStatus = newStatus;

      // Record status change in history
      order.statusHistory.push({
        status: newStatus,
        changedAt: new Date(),
        note: note ? note : `order status changed to ${newStatus}`,
      });

      // Restore inventory if order is cancelled and stock was reduced
      if (newStatus === ORDER_STATUS.CANCELLED && order.stockReduced) {
        await orderRepository.updateProductInventory(
          order.products,
          session,
          "increase"
        );
        order.stockReduced = false;
      }

      await order.save({ session });
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };


  // -------------------------------- Payment Section --------------------------------


  async initializePayment(orderId) {
    try {
      const order = await orderRepository.findById(orderId);
      if (!order) throw customError("Order not found", 404);
   
      if (order.orderStatus !== ORDER_STATUS.PENDING)
        throw customError("Payment can not made for this order", 400);
     
      const totalAmount = order.totalPrice;
      const paymentIntent = await stripeService.createPaymentIntent(totalAmount);
    

      order.payment.paymentIntentId = paymentIntent.paymentIntentId;
      await order.save();
      
      return {
        ...paymentIntent,
        orderId
      }
    } catch (error) {
      throw error;
    }
  }

handleStripeWebhookManually = async (paymentIntentId) => {
    try {
      const result = await stripeService.getPayment(paymentIntentId);
      console.log("result status: ", result.status);
      
      let updatedOrderData;
      
      switch (result.status) {
        case "succeeded":
          updatedOrderData = await this.handleSuccess(result);
          break;

        case "payment_failed":
          updatedOrderData = await this.handleFailed(result);
          break;

        case "canceled":
          updatedOrderData = await this.handleCanceled(result);
          break;

        case "requires_payment_method":
          
          updatedOrderData = await this.handleRequiresPaymentMethod(result);
          break;

        case "requires_confirmation":
          
          updatedOrderData = await this.handleRequiresConfirmation(result);
          break;

        case "requires_action":
          
          updatedOrderData = await this.handleRequiresAction(result);
          break;

        case "processing":
          
          updatedOrderData = await this.handleProcessing(result);
          break;

        case "requires_capture":
         
          updatedOrderData = await this.handleRequiresCapture(result);
          break;

        default:
          
          const order = await orderRepository.findByPaymentIntentId(paymentIntentId);
          updatedOrderData = order;
      }

      return updatedOrderData;
    } catch (err) {
      console.error("Webhook error:", err.message);
      throw err;
    }
};



handleRequiresPaymentMethod = async (paymentIntent) => {
    try {
        const order = await orderRepository.findByPaymentIntentId(paymentIntent.id);
        
        if (!order) {
            throw customError("Order not found", 404);
        }

        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.FAILED,
            'orderStatus': ORDER_STATUS.CANCELLED,
            'payment.failedAt': new Date()
            
        });

        return {
            order: updatedOrder,
            paymentStatus: 'requires_payment_method',
            message: 'Payment method required. Please complete the payment.'
        };
    } catch (error) {
        throw error;
    }
};

handleRequiresConfirmation = async (paymentIntent) => {
    try {
        const order = await orderRepository.findByPaymentIntentId(paymentIntent.id);
        
        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PENDING,
           
        });

        return {
            order: updatedOrder,
            paymentStatus: 'requires_confirmation',
            message: 'Payment requires confirmation.'
        };
    } catch (error) {
        throw error;
    }
};

handleRequiresAction = async (paymentIntent) => {
    try {
        const order = await orderRepository.findByPaymentIntentId(paymentIntent.id);
        
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
    } catch (error) {
        throw error;
    }
};

handleProcessing = async (paymentIntent) => {
    try {
        const order = await orderRepository.findByPaymentIntentId(paymentIntent.id);
        
        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PENDING,
            
        });

        return {
            order: updatedOrder,
            paymentStatus: 'processing',
            message: 'Payment is being processed.'
        };
    } catch (error) {
        throw error;
    }
};

handleRequiresCapture = async (paymentIntent) => {
    try {
        const order = await orderRepository.findByPaymentIntentId(paymentIntent.id);
        
        const updatedOrder = await orderRepository.update(order._id, {
            'payment.status': PAYMENT_STATUS.PENDING,
            'orderStatus': ORDER_STATUS.PROCESSING,
            
        });

        return {
            order: updatedOrder,
            paymentStatus: 'requires_capture',
            message: 'Payment authorized, awaiting capture.'
        };
    } catch (error) {
        throw error;
    }
};

  handleStripeWebhook = async (signature, rawBody) => {
    try {
      const event = stripeService.constructEvent(rawBody, signature);
      console.log(`Processing webhook event: ${event.type} (${event.id})`);

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handleSuccess(event.data.object);
          break;

        case "payment_intent.payment_failed":
          await this.handleFailed(event.data.object);
          break;

        case "payment_intent.canceled":
          await this.handleCanceled(event.data.object);
          break;

        case "payment_intent.requires_action":
          console.log(`Payment requires action for PaymentIntent: ${event.data.object.id}`);
          break;

        default:
          console.log("Unhandled event:", event.type);
      }

      return true
    } catch (err) {
      console.error("Webhook error:", err.message);
    }
  };

  async handleSuccess(paymentIntent) {
    const order = await orderRepository.findOne({ "payment.paymentIntentId": paymentIntent.id });
    if (!order) return;

    order.orderStatus = ORDER_STATUS.PROCESSING;
    order.payment.status = PAYMENT_STATUS.SUCCESS;
    order.payment.paidAt = Date.now();
    order.payment.transactionId = paymentIntent.latest_charge;
    order.payment.paymentSystemData = paymentIntent;
   const savedOrder =  await order.save();
    return {
      order: savedOrder,
      paymentStatus: "succeeded",
      message: "Payment done successfully"
    }
  }

  async handleFailed(paymentIntent) {
    const order = await orderRepository.findOne({ "payment.paymentIntentId": paymentIntent.id });
    if (!order) return;

    order.payment.status = PAYMENT_STATUS.FAILED;
    order.payment.paymentSystemData = paymentIntent;
    order.payment.failedAt = Date.now();
    const savedOrder =  await order.save();
    return { 
      order:savedOrder,
      paymentStatus: "payment_failed",
      message: "payment failed"
    }
  }

  async handleCanceled(paymentIntent) {
    const order = await orderRepository.findOne({ "payment.paymentIntentId": paymentIntent.id });
    if (!order) return;

    order.orderStatus = ORDER_STATUS.CANCELLED;
    order.payment.status = PAYMENT_STATUS.CANCELLED;
    order.payment.paymentSystemData = paymentIntent;
    const savedOrder =  await order.save();
    return {
      order: savedOrder,
      paymentStatus: "canceled",
      message: "Payment canceled"
    }
  }

  confirmPayment = async(orderId, paymentMethodId)=>{
    if(!paymentMethodId){
      throw customError("payment method id not found", 404)
    }
    const session = await startSession();
    try {
      session.startTransaction()
      const order = await orderRepository.findById(orderId, session);

      if(!order){
        throw customError("Invalid order or order not found" , 404);
      }

      if (!order.payment.paymentIntentId) {
            throw customError("No payment intent found for this order", 400);
        }

        const confirmPayment = await stripeService.confirmPayment(order.payment.paymentIntentId, paymentMethodId);
        if(confirmPayment.status === 'succeeded'){
          order.payment.status === PAYMENT_STATUS.SUCCESS;
          order.status === ORDER_STATUS.PROCESSING;
          order.payment.paidAt = new Date();
          order.payment.transactionId = confirmPayment.id;
        }

       const saveOrder =  await order.save({session});
       if(!saveOrder){
        throw customError("payment is confirmed but order data not updated", 400);
       }


    } catch (error) {
      throw error
    }

  }


  testConfirmPayment = async(orderId)=>{
    try {
       const order = await orderRepository.findById(orderId);

      if(!order){
        throw customError("Invalid order or order not found" , 404);
      }

      if (!order.payment.paymentIntentId) {
            throw customError("No payment intent found for this order", 400);
        }

      // if(order.payment.status === PAYMENT_STATUS.SUCCESS){
      //   throw customError("Payment already done for this order", 400)
      // }

        const response = await this.handleStripeWebhookManually(order.payment.paymentIntentId)
        console.log("response: ", response)
        return response
    } catch (error) {
      throw error
    }
  }
}

const orderService = new OrderService();
module.exports = orderService;
