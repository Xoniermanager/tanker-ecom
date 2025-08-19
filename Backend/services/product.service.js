const mongoose = require("mongoose");
const { Types } = require("mongoose");
const productRepository = require("../repositories/product/product.repository");
const inventoryRepository = require("../repositories/product/inventory.repository");
const customError = require("../utils/error");
const { generateSlugIfNeeded } = require("../utils/slug");

const summaryFields = "";

class ProductService {
    /**
     * Retrieves paginated products with optional filters.
     * @param {number} [page=1] - The page number for pagination.
     * @param {number} [limit=10] - Number of products per page.
     * @param {object} [filters={}] - Filters (category, status, name).
     * @returns {Promise<object>} Paginated list of products.
     */
    async getAllProducts(page = 1, limit = 10, filters = {}) {
        const query = {};

        if (filters.category) {
            try {
                query.category = new Types.ObjectId(String(filters.category));
            } catch {
                throw customError("Invalid category ID", 400);
            }
        }

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.name) {
            query.name = { $regex: filters.name, $options: "i" };
        }

        if (filters.brand) {
            query.brand = { $regex: `^${filters.brand}$`, $options: "i" }; 
        }

        return await productRepository.paginate(
            query,
            page,
            limit,
            { createdAt: -1 },
            null,
            summaryFields,
            [
                {
                    path: "category",
                    select: "_id name slug",
                },
                {
                    path: "inventory",
                    select: "_id quantity status",
                }
            ]
        );
    }

    /**
     * Fetches a single product by its slug and includes inventory quantity.
     * @param {string} slug - The product slug.
     * @returns {Promise<object>} Product details with inventory quantity.
     */
    async getProductBySlug(slug) {
        try {
            if (!slug || typeof slug !== "string") {
                throw customError("Invalid product slug", 400);
            }

            const product = await productRepository.findBySlug(slug, null, [{
                path: "inventory",
                select: "_id quantity status",
            }, {
                path: "category",
                select: "-status -createdAt -updatedAt"
            }]);

            if (!product) {
                throw customError("Product not found", 404);
            }

            return product.toObject()
        } catch (err) {
            throw err;
        }
    }

    /**
     * Creates a new product and its inventory entry.
     * @param {object} data - Product data (name, slug, category, initialQuantity, etc.).
     * @returns {Promise<object>} Created product.
     */
    async createProduct(data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            data.slug = await generateSlugIfNeeded(
                data.name,
                data.slug,
                productRepository,
                session
            );
            
            const product = await productRepository.create(data, session);

            await inventoryRepository.create(
                { product: product._id, quantity: data.initialQuantity || 0 },
                session
            );

            await session.commitTransaction();
            return product;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Updates an existing product by ID.
     * @param {string} id - Product ID.
     * @param {object} data - Updated product fields.
     * @returns {Promise<object>} Updated product.
     */
    async updateProduct(id, data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const updatedProduct = await productRepository.update(id, data, session);

            await session.commitTransaction();
            return updatedProduct;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Deletes a product and its inventory entry.
     * @param {string} id - Product ID.
     * @returns {Promise<object>} Deleted product.
     */
    async deleteProduct(id) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            await inventoryRepository.deleteByProduct(id, session);
            const deleted = await productRepository.deleteById(id, session);

            await session.commitTransaction();
            return deleted;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Toggles a product's status between 'active' and 'inactive'.
     * @param {string} productId - Product ID.
     * @returns {Promise<string>} New product status.
     */
    async toggleProductStatus(productId) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw customError("Invalid product ID");
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw customError("Product not found");
        }

        const newStatus = product.status === "active" ? "inactive" : "active";
        product.status = newStatus;
        await product.save();

        return newStatus;
    }

    /**
     * Fetch all unique brands from products.
     * @returns {Promise<string[]>} List of unique brand names.
     */
    async getBrandsForFilter() {
        return productRepository.getAllUniqueBrands();
    }
}

module.exports = new ProductService();
