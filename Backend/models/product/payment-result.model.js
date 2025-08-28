const {Schema, model} = require("mongoose")

const paymentResult = new Schema({
    transactionId: { type: String, trim: true, required: true },
    paymentStatus: { type: Boolean, default: false, required: true },
    paymentResponse: { type: Schema.Types.Mixed, required: true }
},{timestamps: true})

module.exports = model('PaymentResult', paymentResult)