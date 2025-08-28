const mongoose = require("mongoose");
const cartRepository = require("../repositories/cart.repository");
const customError = require("../utils/error");

/**
 * CartService handles business logic for user's shopping cart.
 */
class CartService {
    /**
     * Gets the current user's cart.
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>}
     */
    async getCart(userId) {
        const cart = await cartRepository.getUserCart(userId);
        if (!cart) {
            throw customError("Cart not found", 404);
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
        const totalCartItems = cart.items.reduce((acc, init)=> Number(acc) + Number(init.quantity), 0);

        return {
            ...cart.toObject(),
            totalAmount,
            totalCartItems
        };
    }

    /**
     * Adds an item to the user's cart or increases quantity if already exists.
     * @param {String} userId 
     * @param {String} productId 
     * @param {Number} quantity 
     */
    async addItem(userId, productId, quantity = 1) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const updatedCart = await cartRepository.addOrUpdateItem(userId, productId, quantity, session);

            await session.commitTransaction();
            return updatedCart;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Removes an item from the cart.
     * @param {String} userId 
     * @param {String} productId 
     */
    async removeItem(userId, productId) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const updatedCart = await cartRepository.removeItem(userId, productId, session);

            await session.commitTransaction();
            return updatedCart;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Clears all items from the user's cart.
     * @param {String} userId 
     */
    async clearCart(userId) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const cleared = await cartRepository.clearCart(userId, session);

            await session.commitTransaction();
            return cleared;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Syncs local storage (guest cart) with server cart after login.
     * Merges items, increments quantity if exists.
     * @param {String} userId 
     * @param {Array<{ product: string, quantity: number }>} localItems 
     */
    async syncCart(userId, localItems) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const syncedCart = await cartRepository.syncCart(userId, localItems, session);

            await session.commitTransaction();
            return syncedCart;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new CartService();
