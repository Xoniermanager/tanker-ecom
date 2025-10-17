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

    createBulkProduct = async (req, res, next) => {
    try {
        // const files = req.files || [];
        const { productData } = req.body;

        if (!productData) {
            throw customError("Product data is required", 400);
        }

        let parsedData;
        try {
            parsedData = JSON.parse(productData);
        } catch (parseError) {
            throw customError("Invalid product data format", 400);
        }

        const { headers, data } = parsedData;

        if (!headers || !data || !Array.isArray(data) || data.length === 0) {
            throw customError("Invalid CSV data structure", 400);
        }

        console.log("Data: ", headers)

        
        const requiredHeaders = ["Part No.", 'Name', 'Category', 'Regular Price', 'Selling Price', 'Brand', 'Quantity', 'Delivery Days', 'shipping charge'];
        const missingHeaders = requiredHeaders.filter(header => 
            !headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
        );

        if (missingHeaders.length > 0) {
            throw customError(`Missing required headers: ${missingHeaders.join(', ')}`, 400);
        }

        const result = await productService.createBulkProducts(headers, data);
        
        customResponse(res, "Bulk products created successfully", {
            totalProcessed: data.length,
            successful: result.successful,
            failed: result.failed,
            errors: result.errors
        });
    } catch (error) {
        next(error);
    }
};


    updateProduct = async (req, res, next) => {
        try {
            const data = req.body;

            const files = req.files || [];
            const incomingImages = data.images;

            const uploadedImages = [];

            for (const file of files) {
                const source = await uploadImage(file.buffer, file.originalname, "uploads/product-images");
                uploadedImages.push({
                    type: "image",
                    source: source.url,
                });
            }

            let uploads = [...incomingImages, ...uploadedImages]

            if(uploads.length > 0){
                data.images = uploads;
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

    deleteBulkProducts = async(req, res, next)=>{
        try {
            const ids = req.body
            console.log("ids: ", ids)
            await productService.deleteBulkProducts(ids)
            return customResponse(res,"All product deleted successfully", 200)

        } catch (error) {
            next(error)
        }
    }

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
