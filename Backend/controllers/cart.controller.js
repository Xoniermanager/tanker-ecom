const cartService = require("../services/cart.service");
const customResponse = require("../utils/response");

class CartController {
    /**
     * Get current user's cart
     */
    getCart = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const cart = await cartService.getCart(userId);

            customResponse(res, "Cart fetched successfully.", cart);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Add an item to cart or increase quantity if already exists
     */
    addItem = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const { productId, quantity } = req.body;

            const updatedCart = await cartService.addItem(userId, productId, quantity);

            customResponse(res, "Item added to cart successfully.", updatedCart);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Clear cart of a user
     */
    clearCart = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const updatedCart = await cartService.clearCart(userId);
            customResponse(res, "Cart cleared successfully.", updatedCart);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Remove an item from cart
     */
    removeItem = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const { productId } = req.params;

            const updatedCart = await cartService.removeItem(userId, productId);

            customResponse(res, "Item removed from cart successfully.", updatedCart);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Sync local storage cart with server cart (on login)
     */
    syncCart = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const { localCart } = req.body;

            const updatedCart = await cartService.syncCart(userId, localCart);

            customResponse(res, "Cart synced successfully.", updatedCart);
        } catch (error) {
            next(error);
        }
    };
}

exports.CartController = CartController;
