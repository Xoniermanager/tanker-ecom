const mongoose = require("mongoose");

const SectionContentSchema = new mongoose.Schema({
    order: Number,
    type: { type: String, enum: ["text", "list", "group", "cards", "card", "reference_content", "phone", "link"], required: true },
    label: { type: String, required: true },
    suffix: String,
    subtitle: String,
    text: String,
    title: String,
    description: String,
    phone_number: String,
    link: String,
    ref: String,
    contents: [this]
}, { _id: false });

const SectionSchema = new mongoose.Schema({
    section_id: { type: String, required: true },
    heading: String,
    subheading: String,
    order: Number,
    thumbnail: {
        type: {
            type: String,
            enum: ["video", "image"]
        },
        source: String
    },
    contents: [SectionContentSchema]
}, { timestamps: true });

module.exports = mongoose.model("Section", SectionSchema);