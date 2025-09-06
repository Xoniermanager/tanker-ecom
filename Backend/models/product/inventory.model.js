const { Schema, model } = require("mongoose");
const { STOCK_STATUS } = require("../../constants/enums");

const inventorySchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    salesCount: {
      type: Number,
      min: [0, "sales count don't be negative"],
      default: 0,
      index: true
    },
    status: {
        type: String,
        enum: Object.values(STOCK_STATUS),
        default: STOCK_STATUS.IN_STOCK,
    },
}, { timestamps: true }
);

module.exports = model("Inventory", inventorySchema);