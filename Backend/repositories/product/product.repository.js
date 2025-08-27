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
     * @param {String|Object|Array|null} [populateOptions=null] - Paths to populate; can be a string, object, or array of strings/objects.
     * @returns {Promise<Object|null>} Product document or null.
     */
    async findBySlug(slug, session = null, populateOption = null) {
        return this.model.findOne({ slug }).populate(populateOption).session(session);
    }

     async findProductById(id, session = null, populateOption = null) {
        return this.model.findOne({ _id: id }).populate(populateOption).session(session);
    }

    /**
     * Fetch all unique brands from products.
     * @returns {Promise<string[]>} List of unique brand names.
     */
    async getAllUniqueBrands() {
        const results = await this.model.aggregate([
            {
                $group: {
                    _id: { $toLower: "$brand" }
                }
            },
            {
                $replaceRoot: { newRoot: { brand: "$_id" } }
            }
        ]);

        return results.map(r => {
            return {
                "label": r.brand.charAt(0).toUpperCase() + r.brand.slice(1),
                "value": r.brand.toLowerCase()
            }
        });
    }

    

    
}

module.exports = new ProductRepository();
