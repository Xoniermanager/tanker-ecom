const { startSession } = require("mongoose");
const orderRepository = require("../repositories/product/order.repository");
const userRepository = require("../repositories/user.repository");
const customError = require("../utils/error");
const productRepository = require("../repositories/product/product.repository");
const { STOCK_STATUS } = require("../constants/enums");
const inventoryRepository = require("../repositories/product/inventory.repository");
const customResponse = require("../utils/response");
const cartRepository = require("../repositories/cart.repository");

class OrderService {
  createOrder = async (payload) => {
    const session = await startSession();
    try {
      session.startTransaction();
      const userExist = await userRepository.findById(payload.user, session);
      if (!userExist) {
        throw customError("User not exist", 404);
      }

      await this.checkProductExistWithQuantity(payload.products, session);

      await this.updateProductInventory(payload.products, session);

      const result = await orderRepository.create(payload, session);

      const isCartClear = await cartRepository.clearUserCart(
        { user: payload.user },
        session
      );

      if (!isCartClear) {
        throw customError("unable to clear cart items for this user", 400);
      }

      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  checkProductExistWithQuantity = async (products, session) => {
    for (const item of products) {
      const product = await productRepository.findProductById(
        item.product,
        session,
        [{
            path: "inventory",
            select: "_id quantity status",
          }]
      );

      if (!product) {
        throw customError(`Sorry ${item.name} product not found please remove it from cart`, 404);
      }

      if (!product.status) {
        throw customError(`${item.name} product is not available please remove it from cart`, 400);
      }

      if (String(product.inventory.status) !== String(STOCK_STATUS.IN_STOCK)) {
        throw customError(`${item.name} is out of stock please remove it from cart`);
      }

      if (product.inventory.quantity < item.quantity) {
        throw customError(`${item.name} product quantity not sufficient please decrease product quantity`);
      }
    }
    return true;
  };

  updateProductInventory = async (products, session) => {
    try {
      for (const item of products) {
        console.log("item: ", item);
        const isUpdate = await inventoryRepository.updateInventory(
          item.product,
          {
            $inc: {
              quantity: -item.quantity,
            },
          },
          session
        );
        if (!isUpdate) {
          throw customError("Product inventory not updated", 500);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  getAll = async() =>{
    try {
        const response = await orderRepository.paginate({data, total, page, limit, totalPages})
        if(!response){
            throw customError("Order data not found", 404)
        }

        return response

    } catch (error) {
        throw error
    }
  }
}

const orderService = new OrderService();

module.exports = orderService;
