const { Schema, model } = require("mongoose");
const { STOCK_STATUS } = require("../../constants/enums");

const ProductCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    status:{
      type:Boolean,
      default: true
    },
    description: {
      type: String,
      default: "",
    },
    
  },
  { timestamps: true }
);

const productService = model("ProductCategory", ProductCategorySchema);

module.exports = productService
