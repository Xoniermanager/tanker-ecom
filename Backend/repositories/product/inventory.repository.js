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
    return this.model
      .findOne({ product: productId })
      .populate({ path: "product", select: "name sellingPrice slug" })
      .session(session);
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
    console.log("productId: ", productId);
    return this.model.deleteMany({ product: productId }).session(session);
  }

  async bulkDeleteByProductIds(ids = [], session = null) {
        if (!Array.isArray(ids) || ids.length === 0) return { deletedCount: 0 };

        const result = await this.model.deleteMany(
            { product: { $in: ids } },
            { session }
        );

        return result;
    }

  updateInventory = async (productId, data = {}, session) => {
    return this.model.findOneAndUpdate({ product: productId }, data, {
      new: true,
      session,
    });
  };

  getTopSellingProducts = async (projection = null, session = null) => {
    const pipeline = [
      // {
      //     $match: { stockStatus: "in_stock" }
      // },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $sort: {
          salesCount: -1,
        },
      },
      {
        $limit: 5,
      },
    ];

    if (projection) {
      pipeline.push({ $project: projection });
    }

    const options = session ? { session } : {};
    const result = await this.model.aggregate(pipeline, options);
    return result;
  };
}

module.exports = new InventoryRepository();
