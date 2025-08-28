const { Schema, model } = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHODS, NEWZEALAND_REGIONS, PAYMENT_STATUS, COUNTRIES } = require("../../constants/enums");
const encryptionPlugin = require("../../plugins/encryptionPlugin");

const countries = Object.values(COUNTRIES).map(item => item.value);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, index: true },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    firstName: { type: String, required: true, trim: true, lowercase: true },
    lastName: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },

    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        sellingPrice: { type: Number, required: true, min: 0 },
      }
    ],

    address: {
      billingAddress: {
        address: { type: String, required: true, trim: true },
        // state: { type: String, required: true, enum: Object.values(NEWZEALAND_REGIONS) },
        country: { type: String, required: true, enum: Object.values(countries) },
        city: { type: String, required: true },
        pincode: { type: Number, required: true, min: 1000, max: 9999 },
      },
      shippingAddress: {
        address: { type: String, required: true, trim: true },
        // state: { type: String, required: true, enum: Object.values(NEWZEALAND_REGIONS) },
        country: { type: String, required: true, enum: Object.values(countries) },
        city: { type: String, required: true },
        pincode: { type: Number, required: true, min: 1000, max: 9999 },
      },
    },

    totalPrice: { type: Number, min: 0 },
    totalQuantity: { type: Number, min: 1 },

    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },

    statusHistory: [
      {
        status: { type: String, enum: Object.values(ORDER_STATUS) },
        changedAt: { type: Date, default: Date.now },
        note: String,
      }
    ],

    payment: {
      method: { type: String, enum: Object.values(PAYMENT_METHODS), required: true },
      status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
      transactionId: String,
      paidAt: Date,
    },

    stockReduced: { type: Boolean, default: false },

    orderNotes: { type: String, trim: true }
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {

  if (this.products && this.products.length > 0) {
    this.totalPrice = this.products.reduce((acc, init) => {
      return acc + init.quantity * init.sellingPrice;
    }, 0);
  } else {
    this.totalPrice = 0;
  }
  next();
});

orderSchema.pre("save", function (next) {
  this.totalPrice = this.products.reduce((acc, p) => acc + p.quantity * p.sellingPrice, 0);
  this.totalQuantity = this.products.reduce((acc, p) => acc + p.quantity, 0);
  next();
});

orderSchema.plugin(encryptionPlugin, {
  encryptable: [
    "address.billingAddress.name",
    "address.billingAddress.address",
    "address.billingAddress.pincode",
    "address.shippingAddress.name",
    "address.shippingAddress.address",
    "address.shippingAddress.pincode",
  ]
})

module.exports = model("Order", orderSchema);
