const inventoryService = require("../services/inventory.service");
const customError = require("../utils/error");
const customResponse = require("../utils/response");

class InventoryController {
    /**
     * Get inventory by product ID.
     */
    getInventoryByProduct = async (req, res, next) => {
        try {
            const { productId } = req.params;
            const inventory = await inventoryService.getInventoryByProduct(productId);
            customResponse(res, "Inventory fetched successfully", inventory);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update inventory quantity for a product.
     */
    updateInventory = async (req, res, next) => {
        try {
            const { productId } = req.params;
            const { quantity, status } = req.body;

            const updatedInventory = await inventoryService.updateInventory(productId, quantity, status);
            customResponse(res, "Inventory updated successfully", updatedInventory);
        } catch (error) {
            next(error);
        }
    };
}

exports.InventoryController = InventoryController;
