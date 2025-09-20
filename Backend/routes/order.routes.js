const { Router } = require("express");
const {
    validateOrder,
    validateOrderFilter,
    validateChangeOrderStatus,
    validateCancelOrderByUser
} = require('../middlewares/validation');
const authorize = require("../middlewares/auth");
const OrderController = require("../controllers/order.controller");

const router = Router();
const orderController = new OrderController();

// ==================== Order Routes ====================
router.post('/', validateOrder, authorize(['user']), orderController.createOrder);
router.get('/', validateOrderFilter, authorize(['user', 'admin']), orderController.getOrders);
router.get('/:orderId', authorize(['user', 'admin']), orderController.getOrderDetailById);
router.get('/by-number/:orderNumber', authorize(['user', 'admin']), orderController.getOrderByOrderNumber);
router.post('/cancel/:orderId', validateCancelOrderByUser, authorize(['user']), orderController.cancelOrder);
router.patch('/status/:orderId', validateChangeOrderStatus, authorize(['admin']), orderController.changeOrderStatus);
router.post('/payment/:orderId', authorize(['user', 'admin']), orderController.initializePayment);
router.get('/retrieve-payment/:orderId', authorize(['user', 'admin']), orderController.testConfirmPayment)
router.post('/payment/confirm/:orderId', authorize(['user', 'admin']), orderController.confirmPayment);

module.exports = router