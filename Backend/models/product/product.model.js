const { Schema, model } = require("mongoose");
const { PRODUCT_STATUS } = require("../../constants/enums");
const inventoryModel = require("./inventory.model");

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
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    highlights: {
      type: [String],
      validate: [arrayLimit, "maximum highlights limit 10"],
    },
    specifications: {
      type: {
        type: String,
        enum: ["pdf", "image"],
      },
      source: String,
    },
    specifications_search_index: {
      type: [String],
      index: true,
    },
    images: {
      type: [
        {
          source: { type: String, required: true },
          type: {
            type: String,
            enum: ["image"],
            default: "image",
          },
        },
      ],
      validate: {
        validator: function (val) {
          // Only enforce on creation
          if (this.isNew) {
            return Array.isArray(val) && val.length >= 1;
          }
          return true;
        },
        message: "At least one image is required",
      },
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: "active",
    },
    
    measurements: [{
       measurementName : {type: String, trim: true},
       measurementValue: {type: String, trim: true}
    }],
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 10;
}

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// virtual for inventory
productSchema.virtual("inventory", {
  ref: "Inventory",
  localField: "_id",
  foreignField: "product",
  justOne: true,
});

module.exports = model("Product", productSchema);
