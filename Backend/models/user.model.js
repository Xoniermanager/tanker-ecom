const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {encryptionPlugin} = require("../plugins/encryptionPlugin");
const ENUMS = require("../constants/enums");

const userSchema = new mongoose.Schema(
    {
        // Company Info
        companyEmail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        // Contact Person Info
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        designation: {
            type: String,
            trim: true,
            required: false,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        alternativeEmail: {
            type: String,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            required: false,
        },
        profileImage:{
            type: String,
            default: null
        },

        // Preferences
        country: {
            type: String,
            required: false,
        },
        preferredLanguage: {
            type: String,
            required: false,
        },
        communicationPreference: {
            type: String,
            enum: Object.values(ENUMS.COMMUNICATION_PREFERENCE),
            required: false,
        },

        // Auth
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(ENUMS.USER_ROLES),
            default: ENUMS.USER_ROLES.USER,
        },
        status: {
            type: String,
            enum: Object.values(ENUMS.USER_STATUS),
            default: ENUMS.USER_STATUS.ACTIVE,
        },
        emailVerifiedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// 🔐 Hash password on save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check admin role
userSchema.methods.isAdmin = function () {
    return this.role === "admin";
};

// Hide sensitive fields from JSON output
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    },
});

// AES Encryption for confidential fields
userSchema.plugin(encryptionPlugin, {
    encryptable: ["mobileNumber", "alternativeEmail"],
});

module.exports = mongoose.model("User", userSchema);
