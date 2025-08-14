const express = require("express");
const { ProductController } = require("../controllers/product.controller");
const { validateProduct, validateUpdateProduct } = require("../middlewares/validation");
const authorize = require("../middlewares/auth");
const upload = require("../config/multer");

const router = express.Router();
const productController = new ProductController();

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

module.exports = router;