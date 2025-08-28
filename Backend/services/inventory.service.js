const mongoose = require("mongoose");
const inventoryRepository = require("../repositories/product/inventory.repository");
const customError = require("../utils/error");

class InventoryService {
    /**
     * Fetch inventory by its associated product ID.
     * 
     * @async
     * @param {string} productId - The ID of the product whose inventory is to be fetched.
     * @returns {Promise<Object>} The inventory document for the given product.
     */
    async getInventoryByProduct(productId) {
        const inventory = await inventoryRepository.findByProduct(productId);
        if (!inventory) throw customError("Inventory not found", 404);
        return inventory;
    }

    /**
    * Update inventory quantity for a given product.
    * Uses a transaction to ensure data consistency.
    * 
    * @async
    * @param {string} productId - The product ID whose inventory is to be updated.
    * @param {number} quantity - The new quantity to set.
    * @returns {Promise<Object>} The updated inventory document.
    */
    async updateInventory(productId, quantity, status) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const updated = await inventoryRepository.updateQuantity(
                productId,
                quantity,
                status,
                session
            );

            if (!updated) throw customError("Inventory not found", 404);

            await session.commitTransaction();
            return updated;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Adjust inventory quantity for a given product by a specified change value.
     * This is typically used for incrementing or decrementing stock levels.
     * 
     * @async
     * @param {string} productId - The product ID whose inventory is to be adjusted.
     * @param {number} change - The amount to adjust the quantity by (positive or negative).
     * @returns {Promise<Object>} The updated inventory document.
     * @throws {Error} If inventory is not found or the transaction fails.
     */
    async adjustInventory(productId, change) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const inventory = await inventoryRepository.findByProduct(productId, session);
            if (!inventory) throw customError("Inventory not found", 404);

            inventory.quantity += change;
            await inventory.save({ session });

            await session.commitTransaction();
            return inventory;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new InventoryService();
