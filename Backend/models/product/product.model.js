const { Schema, model } = require("mongoose");
const { PRODUCT_STATUS, PACKAGE_TYPE } = require("../../constants/enums");
const inventoryModel = require("./inventory.model");


const productSchema = new Schema(
  {
    partNumber:{
      type: String,
      required: true,
      trim: true
    },
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
    // shippingPrice: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },
    shortDescription: {
      type: String,
      // required: true,
      trim: true,
    },
    description: {
      type: String,
      // required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      trim: true,
      default: "Not Found",
    },
    highlights: {
      type: [String],
      validate: [arrayLimit, "maximum highlights limit 10"],
    },
    specificationsDoc: {
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

    measurements: [
      {
        measurementName: { type: String, trim: true },
        measurementValue: { type: String, trim: true },
      },
    ],
    deliveryDays: {
      type: String,
      // required: true,
      default: "10",
    },
    // specifications: {
    //   height: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     match: [
    //       /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2})(?:\.[0-9]{1,2})?$/,
    //       "Height must be a valid number (0-999.99)",
    //     ],
    //   },
    //   length: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     match: [
    //       /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2})(?:\.[0-9]{1,2})?$/,
    //       "Length must be a valid number (0-999.99)",
    //     ],
    //   },
    //   width: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     match: [
    //       /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2})(?:\.[0-9]{1,2})?$/,
    //       "Width must be a valid number (0-999.99)",
    //     ],
    //   },
    //   weight: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //      match: [/^[0-9]+$/, "Weight must be a valid integer (e.g., 34)"],
    //   },
    //   volume: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     match: [
    //       /^(?:[0-9]|[1-9][0-9]{1,4})(?:\.[0-9]{1,2})?$/,
    //       "Volume must be a valid number (0-99999.99)",
    //     ],
    //   },
    //   packTypeCode:{
    //     type: String,
    //     required: true,
    //     enum: Object.values(PACKAGE_TYPE).map(item => item.code),
    //   }
    // },
    
    shippingCharge:{
       type: Number,
       min: 0,
       required: true
    },
    shipping: {
      type: String,
    },
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
