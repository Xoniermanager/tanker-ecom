const { Router } = require("express");
const {
    validateOrder,
    validateOrderFilter,
    validateChangeOrderStatus
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
router.post('/cancel/:orderId', authorize(['user']), orderController.cancelOrder);
router.put('/status/:orderId', validateChangeOrderStatus, authorize(['admin']), orderController.changeOrderStatus);

module.exports = router