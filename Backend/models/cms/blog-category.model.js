const mongoose = require("mongoose");

const BlogCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    }
}, { timestamps: true });

module.exports = mongoose.model("BlogCategory", BlogCategorySchema);
