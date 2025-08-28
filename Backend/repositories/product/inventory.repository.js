const Inventory = require("../../models/product/inventory.model");
const BaseRepository = require("../base.repository");

class InventoryRepository extends BaseRepository {
    constructor() {
        super(Inventory);
    }

    /**
     * Finds inventory for a specific product.
     * @param {ObjectId} productId - The product ID.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object|null>} Inventory record or null.
     */
    async findByProduct(productId, session = null) {
        return this.model.findOne({ product: productId }).populate({path:"product", select: "name sellingPrice slug"} ).session(session);
    }

    /**
     * Updates inventory quantity for a product.
     * @param {ObjectId} productId - The product ID.
     * @param {number} quantity - The new quantity value.
     * @param {mongoose.ClientSession} [session=null] - Optional mongoose session.
     * @returns {Promise<Object|null>} Updated inventory document or null.
     */
    async updateQuantity(productId, quantity, status, session = null) {
        return this.model.findOneAndUpdate(
            { product: productId },
            { $set: { quantity, status } },
            { new: true, session }
        );
    }

    async deleteByProduct(productId, session) {
        return this.model.deleteMany({ product: productId }).session(session);
    }

    updateInventory = async(productId, data = {}, session )=>{
       return this.model.findOneAndUpdate({product: productId},  data, {new: true, session})
    }
}

module.exports = new InventoryRepository();