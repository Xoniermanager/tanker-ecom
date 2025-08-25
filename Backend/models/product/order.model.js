const { Schema, model } = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHODS } = require("../../constants/enums");

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity don't be zero or negative"],
        },
        sellingPrice: {
          type: Number,
          required: true,
          min: [0, "Selling Price don't be negative"],
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      billingAddress: {
        name: { type: String, required: true, trim: true, lowercase: true },
        address: { type: String, required: true, trim: true },
        pincode: {
          type: Number,
          required: true,
          min: 1000,
          max: 9999,
          match: [/^[1-9][0-9]{3}$/, "Pincode must be a 4-digit number between 1000 and 9999"],
        },
      },
      shippingAddress: {
        name: { type: String, required: true, trim: true, lowercase: true },
        address: { type: String, required: true, trim: true },
        pincode: {
          type: Number,
          required: true,
          min: 1000,
          max: 9999,
          match: [/^[1-9][0-9]{3}$/, "Pincode must be a 4-digit number between 1000 and 9999"],
          
        },
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price don't be negative"]
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: [1, "Total quantity don't be zero or negative"]
    },
    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PROCESSING,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },
    paymentResult: {
      type: Schema.Types.ObjectId,
      ref: "PaymentResult",
    },
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


orderSchema.pre("save", function(next){
    
    if(this.products && this.products.length > 0){
        this.totalQuantity = this.products.reduce((acc, init)=>{
            return acc + init.quantity
        }, 0)
    } else{
        this.totalQuantity = 0
    }
    next();
});

module.exports = model("order", orderSchema);
