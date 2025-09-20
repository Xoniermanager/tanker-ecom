const orderService = require("../services/order.service")
const customResponse = require("../utils/response")

class OrderController {
    /**
     * Create a new order for the logged-in user.
     */
    createOrder = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const payload = { ...req.body, user: userId };
            const response = await orderService.createOrder(payload);
            return customResponse(res, "Order created successfully", response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a paginated list of orders.
     * Admins can see all orders, users can see their own.
     */
    getOrders = async (req, res, next) => {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;

            if (req.user.role !== "admin") {
                filters.userId = req.user._id;
            }

            const response = await orderService.getOrders(page, limit, filters);
            return customResponse(res, "Orders fetched successfully", response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get order details by order ID.
     * Checks ownership unless user is an admin.
     */
    getOrderDetailById = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const response = await orderService.getOrderById(orderId, req.user);
            return customResponse(res, "Order detail fetched successfully", response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get order details by order number.
     * Checks ownership unless user is an admin.
     */
    getOrderByOrderNumber = async (req, res, next) => {
        try {
            const { orderNumber } = req.params;
            const response = await orderService.getOrderByOrderNumber(orderNumber, req.user);
            return customResponse(res, "Order detail fetched successfully", response);
        } catch (error) {
            next(error);
        }
    }

    cancelOrder = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const {reason} = req.body;
            const response = await orderService.cancelOrder(orderId, req.user, reason);
            return customResponse(res, "Order cancelled successfully", response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Change the status of an order.
     * Can only be used by admin.
     * Handles inventory adjustments if order is cancelled.
     */
    changeOrderStatus = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { newStatus, note } = req.body;
            const response = await orderService.changeOrderStatus(orderId, newStatus, note, req.user);
            return customResponse(res, "Order status changed successfully", response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a Stripe PaymentIntent for the given order.
     */
    initializePayment = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const response = await orderService.initializePayment(orderId);
            return customResponse(res, "Payment initialized successfully", response);
        } catch (error) {
            next(error);
        }
    }

    testConfirmPayment = async(req,res,next)=>{
        try {
            const {orderId} = req.params;
            const result = await orderService.testConfirmPayment(orderId)
            return customResponse(res, "payment successful", result)
        } catch (error) {
             next(error)
        }
    }

    confirmPayment = async(req, res, next)=>{
        try {
            const {orderId} = req.params;
            const {paymentMethodId} = req.body;
            const response = await orderService.confirmPayment(orderId, paymentMethodId);

        } catch (error) {
            next(error)
        }
    }
}

module.exports = OrderController