const mongoose = require("mongoose");
const { OTP_TYPES } = require("../constants/enums"); // Adjust path if needed

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(OTP_TYPES),
            required: true,
        },
        expiration: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Otp", otpSchema);
