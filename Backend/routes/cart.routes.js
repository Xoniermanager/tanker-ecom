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
router.get("/", authorize(['user']), cartController.getCart);
router.post("/", authorize(['user']), validateCartItem, cartController.addItem);
router.delete("/:productId", authorize(['user']), cartController.removeItem);
router.delete("/", authorize(['user']), cartController.clearCart);
router.post("/sync", authorize(['user']), validateCartSync, cartController.syncCart);

module.exports = router;
