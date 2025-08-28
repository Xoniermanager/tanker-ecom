const { PRODUCT_STATUS } = require("../constants/enums");
const productService = require("../services/product.service");
const customError = require("../utils/error");
const customResponse = require("../utils/response");
const { uploadImage } = require("../utils/storage");

class ProductController {
    getAllProducts = async (req, res, next) => {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const products = await productService.getAllProducts(+page, +limit, filters);
            customResponse(res, "Products fetched successfully", products);
        } catch (error) {
            next(error);
        }
    };

    getFrontendProducts = async (req, res, next) => {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            filters.status = PRODUCT_STATUS.ACTIVE;
            const products = await productService.getAllProducts(+page, +limit, filters);
            customResponse(res, "Products fetched successfully", products);
        } catch (error) {
            next(error);
        }
    };

    getProductBySlug = async (req, res, next) => {
        try {
            const { slug } = req.params;
            const product = await productService.getProductBySlug(slug);
            customResponse(res, "Product fetched successfully", product);
        } catch (error) {
            next(error);
        }
    };

    createProduct = async (req, res, next) => {
        try {
            const data = req.body;
            const files = req.files || [];

            if (!files.length) {
                throw customError("At least one image is required", 400);
            }

            const uploadedImages = [];
            for (const file of files) {
                const source = await uploadImage(file.buffer, file.originalname, "uploads/product-images");
                uploadedImages.push({
                    type: "image",
                    source: source.url,
                });
            }

            
            data.images = uploadedImages;
            const product = await productService.createProduct(data);
            customResponse(res, "Product created successfully", product);
        } catch (error) {
            next(error);
        }
    };

    updateProduct = async (req, res, next) => {
        try {
            const data = req.body;
            const files = req.files || [];

            const uploadedImages = [];
            for (const file of files) {
                const source = await uploadImage(file.buffer, file.originalname, "uploads/product-images");
                uploadedImages.push({
                    type: "image",
                    source: source.url,
                });
            }

            if(uploadedImages.length > 0){
                data.images = uploadedImages;
            }

            const product = await productService.updateProduct(req.params.id, data);
            customResponse(res, "Product updated successfully", product);
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            await productService.deleteProduct(req.params.id);
            customResponse(res, "Product deleted successfully", null);
        } catch (error) {
            next(error);
        }
    };

    updateProductStatus = async (req, res, next) => {
        try {
            const itemId = req.params.id;
            const status = await productService.toggleProductStatus(itemId);
            customResponse(res, `Product status changes to ${status} successfully`, null);
        } catch (error) {
            next(error);
        }
    };

    getBrandsForFilter = async (req, res, next) => {
        try {
            const result = await productService.getBrandsForFilter();
            customResponse(res, `Product brands fetched successfully`, result);
        } catch (error) {
            next(error);
        }
    };
}

exports.ProductController = ProductController;
