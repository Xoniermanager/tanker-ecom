const Product = require("../../models/product/product.model");
const BaseRepository = require("../base.repository");

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }

    /**
     * Finds product by slug.
     * @param {string} slug - The product slug.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object|null>} Product document or null.
     */
    async findBySlug(slug, session = null, populateOption = null) {
        return this.model.findOne({ slug }).populate(populateOption).session(session);
    }
}

module.exports = new ProductRepository();
