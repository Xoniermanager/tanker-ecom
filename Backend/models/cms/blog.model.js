const mongoose = require("mongoose");
const { getPublicFileUrl } = require("../../utils/storage");

const BlogSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            default: "",
        },
        title: { type: String, required: true },
        subtitle: { type: String },
        author: {
            name: { type: String },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
        thumbnail: {
            type: {
                type: String,
                enum: ["image", "video"],
            },
            source: String,
        },
        tags: {
            type: [String],
            required: true,
            validate: [array => array.length > 0, "At least one tag is required"]
        },
        categories: {
            type: [String],
            required: true,
            validate: [array => array.length > 0, "At least one category is required"]
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },
        isPublished: { type: Boolean, default: true },
        publishedAt: { type: Date, default: Date.now() },
    },
    { timestamps: true }
);

BlogSchema.set("toJSON", { virtuals: true });
BlogSchema.set("toObject", { virtuals: true });

// virtual for thumbnail full URL
BlogSchema.virtual("thumbnail.fullUrl").get(function () {
    if (this.thumbnail?.source) {
        return getPublicFileUrl(this.thumbnail.source);
    }
    return null;
});

module.exports = mongoose.model("Blog", BlogSchema);