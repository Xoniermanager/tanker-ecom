const BaseRepository = require("../base.repository");
const productService = require("../../models/products/product-category.model");

class ProductCategoryRepository extends BaseRepository {
  constructor() {
    super(productService);
  }

  async findBySlug(slug, session = null) {
    const query = this.model.findOne({ slug }).session(session);

    return await query;
  }

  async updateCategoryStatus(id, updatedStatus, session = null) {
    const result = await this.model.findByIdAndUpdate(
      id,
      { $set: { status: updatedStatus } },
      { new: true, runValidators: true, session }
    );

    return result
  }
}

module.exports = new ProductCategoryRepository();
