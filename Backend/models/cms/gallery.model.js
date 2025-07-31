const mongoose = require("mongoose");
const { getPublicFileUrl } = require("../../utils/storage");

const GallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        image: {
            source: { type: String, required: true },
            type: {
                type: String,
                enum: ["image"],
                default: "image",
            },
        },
        alt: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// virtual for image full URL
GallerySchema.virtual("image.fullUrl").get(function () {
    if (this.image?.source) {
        return getPublicFileUrl(this.image.source);
    }
    return null;
});

module.exports = mongoose.model("Gallery", GallerySchema);