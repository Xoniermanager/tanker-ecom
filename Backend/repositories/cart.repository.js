const { STOCK_STATUS, PRODUCT_STATUS } = require("../constants/enums");
const Cart = require("../models/cart.model");
const Product = require("../models/product/product.model");
const Inventory = require("../models/product/inventory.model");
const customError = require("../utils/error");
const BaseRepository = require("./base.repository");

/**
 * Repository class for managing Cart operations.
 * Extends the BaseRepository with custom cart logic like
 * add/update items, syncing local storage carts, etc.
 */
class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }

  /**
   * Get a user's cart with product details populated
   * @param {String} userId - The ID of the user
   * @param {Object} [session=null] - Optional mongoose session for transactions
   * @returns {Promise<Object|null>} The user's cart or null if not found
   */
  async getUserCart(userId, session = null) {
    return this.model
      .findOne({ user: userId })
      .populate({
        path: "items.product",
        populate: {
          path: "inventory",
          model: "Inventory",
        },
      })
      .session(session);
  }

  /**
   * Add a new item or update quantity if it already exists in the cart
   * @param {String} userId - The ID of the user
   * @param {String} productId - The ID of the product
   * @param {Number} [quantity=1] - Quantity to add (negative values decrease quantity)
   * @param {Object} [session=null] - Optional mongoose session for transactions
   * @returns {Promise<Object>} The updated cart
   */
  async addOrUpdateItem(userId, productId, quantity = 1, session = null) {
    let cart = await this.model.findOne({ user: userId }).session(session);

    if (!cart) {
      cart = new this.model({ user: userId, items: [] });
    }

    const product = await Product.findById(productId, { status: 1, name: 1 })
      .session(session)
      .lean();

    if (!product) {
      throw customError("Product does not exist.");
    }

    if (product.status !== PRODUCT_STATUS.ACTIVE) {
      throw customError("This product is not available for purchase.");
    }

    const inventory = await Inventory.findOne(
      { product: productId },
      { quantity: 1, status: 1 }
    )
      .session(session)
      .lean();

    if (!inventory) {
      throw customError("Inventory not found for this product.");
    }
    if (inventory.status === STOCK_STATUS.OUT_OF_STOCK) {
      throw customError(`Product ${product.name} is out of stock.`);
    }
    if (inventory.status === STOCK_STATUS.PRE_ORDER && quantity <= 0) {
      throw customError(
        `Pre-order requires minimum 1 unit for ${product.name}.`
      );
    }

    const stockAvailable = inventory.quantity;

    // ✅ Check existing item in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      if (newQty <= 0) {
        cart.items = cart.items.filter(
          (item) => item.product.toString() !== productId.toString()
        );
      } else if (newQty > stockAvailable) {
        throw customError(`Only ${stockAvailable} units available in stock.`);
      } else {
        existingItem.quantity = newQty;
      }
    } else {
      if (quantity > 0) {
        if (quantity > stockAvailable) {
          throw customError(`Only ${stockAvailable} units available in stock.`);
        }
        cart.items.push({ product: productId, quantity });
      }
    }

    return cart.save({ session });
  }

  /**
   * Remove a specific item from the user's cart
   * @param {String} userId - The ID of the user
   * @param {String} productId - The ID of the product to remove
   * @param {Object} [session=null] - Optional mongoose session
   * @returns {Promise<Object|null>} Updated cart after removal
   */
  async removeItem(userId, productId, session = null) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true, session }
    );
  }

  /**
   * Clear all items from the user's cart
   * @param {String} userId - The ID of the user
   * @param {Object} [session=null] - Optional mongoose session
   * @returns {Promise<Object|null>} The cleared cart
   */
  async clearCart(userId, session = null) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true, session }
    );
  }

  /**
   * Sync local storage cart with server cart after login
   * - Merges items from local storage into the server-side cart
   * - If product already exists, quantities are added
   * - Price snapshot can also be updated
   *
   * @param {String} userId - The ID of the logged-in user
   * @param {Array} localItems - Local storage items [{ product, quantity, price }]
   * @param {Object} [session=null] - Optional mongoose session
   * @returns {Promise<Object>} The updated cart after sync
   */
  async syncCart(userId, localItems, session) {
    let cart = await this.model.findOne({ user: userId }).session(session);
    if (!cart) {
      cart = new this.model({ user: userId, items: [] });
    }

    // Collect all productIds and Fetch all products + inventory
    const productIds = localItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } })
      .populate({ path: "inventory", select: "quantity status" })
      .session(session);

    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    for (const { productId, quantity } of localItems) {
      const product = productMap.get(productId.toString());

      if (!product) {
        throw customError(`Product ${productId} does not exist.`);
      }
      if (product.status !== PRODUCT_STATUS.ACTIVE) {
        throw customError(`Product ${product.name} is not available.`);
      }
      if (!product.inventory) {
        throw customError(`Inventory not found for product ${productId}.`);
      }

      const { quantity: stockAvailable, status: stockStatus } =
        product.inventory;

      // Inventory status check
      if (stockStatus === STOCK_STATUS.OUT_OF_STOCK) {
        throw customError(`Product ${product.name} is out of stock.`);
      }
      if (stockStatus === STOCK_STATUS.PRE_ORDER && quantity <= 0) {
        throw customError(
          `Pre-order requires minimum 1 unit for ${product.name}.`
        );
      }

      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingItem) {
        if (quantity <= 0) {
          cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId.toString()
          );
        } else if (
          stockStatus === STOCK_STATUS.IN_STOCK &&
          quantity > stockAvailable
        ) {
          throw customError(
            `Only ${stockAvailable} units available for ${product.name}.`
          );
        } else {
          existingItem.quantity = quantity;
        }
      } else {
        if (quantity > 0) {
          if (
            stockStatus === STOCK_STATUS.IN_STOCK &&
            quantity > stockAvailable
          ) {
            throw customError(
              `Only ${stockAvailable} units available for ${product.name}.`
            );
          }
          cart.items.push({ product: productId, quantity });
        }
      }
    }

    return cart.save({ session });
  }
}

module.exports = new CartRepository();
