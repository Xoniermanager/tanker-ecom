const BaseRepository = require("../base.repository");
const Order = require("../../models/product/order.model");
const Product = require("../../models/product/product.model");
const Inventory = require("../../models/product/inventory.model");
const { STOCK_STATUS, ORDER_STATUS } = require("../../constants/enums");
const customError = require("../../utils/error");

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  /**
   * Validate that all products in the order exist, are in stock,
   * and have sufficient quantity available.
   *
   * @param {Array} products - Array of products from cart/order.
   *   Each item should include:
   *     - {ObjectId} product - Product ID
   *     - {Number} quantity - Desired quantity
   * @param {Object} session - Mongoose session for transaction safety
   *
   * @throws {Error} If:
   *   - Any product is not found in the database
   *   - Product is unavailable (status = false)
   *   - Product inventory status is not "IN_STOCK"
   *   - Requested quantity exceeds available stock
   *
   * @returns {Array} finalProductData - Array of validated product data:
   *   [
   *     {
   *       product: ObjectId,
   *       name: String,
   *       quantity: Number,
   *       sellingPrice: Number
   *     }
   *   ]
   */
  checkProductExistWithQuantity = async (products, session) => {
    const ids = products.map((p) => p.product);

    const dbProducts = await Product.find({ _id: { $in: ids } })
      .populate([{ path: "inventory", select: "_id quantity status" }, {path: "category"}])
      .session(session);

    if (dbProducts.length !== products.length) {
      throw customError("Some products not found, please refresh cart", 400);
    }

    const finalProductData = [];
    for (const item of products) {
      const product = dbProducts.find(
        (p) => String(p._id) === String(item.product)
      );

      if (!product.status) {
        throw customError(
          `${product.name} is not available, please remove it`,
          400
        );
      }

      if (String(product.inventory.status) !== String(STOCK_STATUS.IN_STOCK)) {
        throw customError(`${product.name} is out of stock`, 400);
      }

      if (product.inventory.quantity < item.quantity) {
        throw customError(
          `${product.name} has only ${product.inventory.quantity} left, please reduce quantity`,
          400
        );
      }

      finalProductData.push({
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        sellingPrice: product.sellingPrice,
        category: product.category._id
      });
    }

    return finalProductData;
  };

  /**
   * Updates product inventory in bulk for a given list of products.
   *
   * This function performs a bulk write operation to adjust the quantity of each product.
   * It also updates the inventory status based on the resulting quantity:
   * - If quantity <= 0 → status is set to `OUT_OF_STOCK`
   * - If quantity > 0 → status is set to `IN_STOCK`
   *
   * Can handle both decreasing (after an order) or increasing (e.g., order cancellation) stock.
   *
   * @param {Array<Object>} products - Array of products to update. Each object should contain:
   *   @property {ObjectId} product - The product ID.
   *   @property {number} quantity - The amount to increase or decrease.
   * @param {Object} session - Optional Mongoose session for transaction support.
   * @param {string} [direction="decrease"] - Operation type: `"decrease"` to reduce stock, `"increase"` to restore stock.
   *
   * @returns {Promise<boolean>} Returns true if inventory was successfully updated.
   */
  updateProductInventory = async (
    products,
    session,
    direction = "decrease"
  ) => {
    const bulkOps = products.map((item) => {
      const qtyChange =
        direction === "decrease" ? -item.quantity : item.quantity;

      return {
        updateOne: {
          filter: { product: item.product },
          update: [
            {
              $set: {
                quantity: { $add: ["$quantity", qtyChange] },
                salesCount: {
                $add: [
                  "$salesCount",
                  direction === "decrease" ? item.quantity : 0,
                ],
              },
              },
            },
            {
              $set: {
                status: {
                  $cond: [
                    { $lte: [{ $add: ["$quantity", qtyChange] }, 0] },
                    STOCK_STATUS.OUT_OF_STOCK,
                    STOCK_STATUS.IN_STOCK,
                  ],
                },
              },
            },
          ],
        },
      };
    });

    const result = await Inventory.bulkWrite(bulkOps, { session });
    if (!result) throw customError("Failed to update inventory", 500);
    return result;
  };

  getOrdersCount = async (startDate, endDate = new Date(), session = null) => {
    const filter = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  

  getDeliveredOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: "delivered",
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getArrivedOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: { $in: [ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED] },
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getPendingOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: {
        $in: [
          ORDER_STATUS.PENDING,
          ORDER_STATUS.PROCESSING,
          ORDER_STATUS.SHIPPED,
        ],
      },
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getCancelledOrdersCount = async (
    startDate,
    endDate = new Date(),
    session = null
  ) => {
    const filter = {
      orderStatus: { $in: [ORDER_STATUS.CANCELLED] },
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.count(filter, session);
  };

  getTotalRevenue = async (startDate, endDate = new Date(), session = null) => {
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          orderStatus: { $nin: [ORDER_STATUS.CANCELLED] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ];

    const query = this.model.aggregate(pipeline);
    if (session) query.session(session);

    const result = await query;
    return result.length > 0 ? result[0].totalRevenue : 0;
  };

  
}

const orderRepository = new OrderRepository();

module.exports = orderRepository;
