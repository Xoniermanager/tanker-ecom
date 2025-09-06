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
    salesMetrics: {
      totalSales: {
        type: Number,
        default: 0,
        min: 0
      },
      totalRevenue: {
        type: Number,
        default: 0,
        min: 0
      },
      totalOrders: {
        type: Number,
        default: 0,
        min: 0
      },
      lastSaleDate: {
        type: Date,
        default: null
      }
    },
    
  },
  { timestamps: true }
);

const productService = model("ProductCategory", ProductCategorySchema);

module.exports = productService
