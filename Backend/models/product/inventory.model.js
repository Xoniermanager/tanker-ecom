const { Schema, model } = require("mongoose");

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
    stockStatus: {
        type: String,
        enum: ["in_stock", "out_of_stock"],
        default: "in_stock",
    },
}, { timestamps: true }
);

module.exports = model("Inventory", inventorySchema);