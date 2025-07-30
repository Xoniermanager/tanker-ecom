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
        tags: [String],
        categories: [String],
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },
        isPublished: { type: Boolean, default: false },
        publishedAt: Date,
    },
    { timestamps: true }
);

// virtual for thumbnail full URL
BlogSchema.virtual("thumbnail.fullUrl").get(function () {
    if (this.thumbnail?.source) {
        return getPublicFileUrl(this.thumbnail.source);
    }
    return null;
});

module.exports = mongoose.model("Blog", BlogSchema);