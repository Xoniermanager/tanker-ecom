const { Schema, model } = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHODS, NEWZEALAND_REGIONS } = require("../../constants/enums");
const encryptionPlugin = require("../../plugins/encryptionPlugin");

const orderSchema = new Schema(
  {
    firstName: {type: String, required: true, trim: true, lowercase: true},
    lastName: {type: String, required: true, trim: true, lowercase: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true },
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
        address: { type: String, required: true, trim: true },
        state: {type: String, required:true, enum: Object.values(NEWZEALAND_REGIONS), trim: true},
        pincode: {
          type: Number,
          required: true,
          min: 1000,
          max: 9999,
          match: [/^[1-9][0-9]{3}$/, "Pincode must be a 4-digit number between 1000 and 9999"],
        },
      },
      shippingAddress: {
        address: { type: String, required: true, trim: true },
        state: {type: String, required:true, enum: Object.values(NEWZEALAND_REGIONS), trim: true},
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
      
      min: [0, "Total price don't be negative"]
    },
    totalQuantity: {
      type: Number,
      min: [1, "Total quantity don't be zero or negative"]
    },
    orderStatus: {
      type: String,
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
    orderNotes:{
      type: String,
      trim: true
    }
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
