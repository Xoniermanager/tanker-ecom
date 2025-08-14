const mongoose = require("mongoose");
const inventoryRepository = require("../repositories/product/inventory.repository");
const customError = require("../utils/error");

class InventoryService {
    /**
     * Get inventory for a product.
     */
    async getInventoryByProduct(productId) {
        const inventory = await inventoryRepository.findByProduct(productId);
        if (!inventory) throw customError("Inventory not found", 404);
        return inventory;
    }

    /**
     * Update inventory quantity.
     */
    async updateInventory(productId, quantity) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const updated = await inventoryRepository.updateQuantity(
                productId,
                quantity,
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
     * Increment or decrement inventory by a certain amount.
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
