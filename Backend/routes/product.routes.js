const express = require("express");
const { ProductController } = require("../controllers/product.controller");
const { InventoryController } = require("../controllers/inventory.controller");
const { validateProduct, validateUpdateProduct, validateInventoryUpdate } = require("../middlewares/validation");
const authorize = require("../middlewares/auth");
const upload = require("../config/multer");

const router = express.Router();
const productController = new ProductController();
const inventoryController = new InventoryController();

// ==================== Product Routes ====================
router.get("/", authorize(['admin']), productController.getAllProducts);
router.get("/frontend", productController.getFrontendProducts);
router.get("/:slug", productController.getProductBySlug);
router.post(
    "/",
    authorize(['admin']),
    upload.any(),
    validateProduct,
    productController.createProduct
);
router.put(
    "/:id",
    authorize(['admin']),
    upload.any(),
    validateUpdateProduct,
    productController.updateProduct
);
router.patch("/:id", authorize(['admin']), productController.updateProductStatus);
router.delete("/:id", authorize(['admin']), productController.deleteProduct);

// ==================== Inventory Routes ====================
router.get("/:productId/inventory", authorize(['admin']), inventoryController.getInventoryByProduct);
router.put(
    "/:productId/inventory",
    authorize(['admin']),
    validateInventoryUpdate,
    inventoryController.updateInventory
);

module.exports = router;