const { Schema, model } = require("mongoose");
const { PRODUCT_STATUS } = require("../../constants/enums");



const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    highlights: {
      type: [String],
      validate: [arrayLimit, "maximum highlights limit 10"],
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: "active",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    specifications: {
      type: [
        {
          Key_parameter: { type: String, required: true },
          values: { type: Object, required: true },
        },
      ],
    },
    specifications_search_index: {
      type: [String],
      index: true,
    },
    images: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
        },
        source: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = model("Product", productSchema);
