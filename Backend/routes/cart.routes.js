const express = require("express");
const { CartController } = require("../controllers/cart.controller");
const {
    validateCartItem,
    validateCartSync,
} = require("../middlewares/validation");
const authorize = require("../middlewares/auth");

const router = express.Router();
const cartController = new CartController();

// ==================== Cart Routes ====================
router.get("/", authorize(['user', 'admin']), cartController.getCart);
router.post("/", authorize(['user', 'admin']), validateCartItem, cartController.addItem);
router.delete("/:productId", authorize(['user', 'admin']), cartController.removeItem);
router.delete("/", authorize(['user', 'admin']), cartController.clearCart);
router.post("/sync", authorize(['user', 'admin']), validateCartSync, cartController.syncCart);

module.exports = router;
