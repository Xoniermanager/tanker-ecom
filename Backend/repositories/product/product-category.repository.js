const BaseRepository = require("../base.repository");
const productService = require("../../models/product/product-category.model");
const customError = require("../../utils/error");

class ProductCategoryRepository extends BaseRepository {
  constructor() {
    super(productService);
  }

  async findBySlug(slug, session = null) {
    const query = this.model.findOne({ slug }).session(session);

    return await query;
  }

  async findActiveCategories(filters = {}, projection = "", sort,  session = null){
    const result = this.model.find(filters).select(projection).sort(sort).session(session)
    return result
  }

  async updateCategoryStatus(id, updatedStatus, session = null) {
    const result = await this.model.findByIdAndUpdate(
      id,
      { $set: { status: updatedStatus } },
      { new: true, runValidators: true, session }
    );

    return result
  }

  manageCategorySalesMetrics = async (products = [], session = null, flow = "increase") => {
 
    if (!products || products.length === 0) {
      return { success: false, message: "No products provided" };
    }

    
    const categoryMap = new Map();
    
    products.forEach(item => {
      if (!item.category || !item.category._id) {
        throw customError("Product missing category information:", 404);
       
      }
      
      const categoryId = item.category._id.toString();
      const quantity = Number(item.quantity) || 0;
      const sellingPrice = Number(item.sellingPrice) || 0;
      const totalPrice = sellingPrice * quantity;
      
      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId);
        existing.totalQuantity += quantity;
        existing.totalRevenue += totalPrice;
        existing.orderCount += 1;
      } else {
        categoryMap.set(categoryId, {
          categoryId,
          totalQuantity: quantity,
          totalRevenue: totalPrice,
          orderCount: 1
        });
      }
    });

    
    const bulkOperations = Array.from(categoryMap.values()).map(item => {
      const multiplier = (flow === "increase") ? 1 : -1;
      
      return {
        updateOne: {
          filter: { _id: item.categoryId },
          update: {
            $inc: {
              "salesMetrics.totalSales": item.totalQuantity * multiplier,
              "salesMetrics.totalRevenue": item.totalRevenue * multiplier,
              "salesMetrics.totalOrders": item.orderCount * multiplier
            },
            $set: {
              "salesMetrics.lastSaleDate": new Date()
            }
          }
        }
      };
    });

    if (bulkOperations.length === 0) {
      throw customError("No valid products to update", 400 );
    }

   
    const options = { ordered: false };
    if (session) {
      options.session = session;
    }

    const response = await this.model.bulkWrite(bulkOperations, options);
    
    if (!response || response.modifiedCount === 0) {
      throw customError("Category metrics not updated");
    }

    return {
      success: true,
      modifiedCount: response.modifiedCount,
      matchedCount: response.matchedCount,
      message: "Category metrics updated successfully"
    };

  
};


  getTopCategories =async(limit = 8, sortBy="totalSales", session=null, sortOrder = -1)=>{
    const sortOption = {}

    sortOption[`salesMetrics.${sortBy}`] = sortOrder
    const result = await this.model.find().limit(limit).sort(sortOption).session(session).lean();
    return result
  }
}

module.exports = new ProductCategoryRepository();
