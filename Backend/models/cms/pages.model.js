const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
    pageId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    seo: {
        metaTitle: {
            type: String,
            required: true,
            trim: true,
        },
        metaDescription: {
            type: String,
            required: true,
            trim: true,
        },
        ogImage: {
            type: String,
            required: false,
            trim: true,
        },
    },
    sections: [
        {
            order: {
                type: Number,
                required: true,
            },
            section_id: {
                type: String,
                required: true,
                trim: true,
            },
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add a method to populate sections manually with proper structure
PageSchema.methods.populateSections = async function () {
    const Section = mongoose.model('Section');
    const sectionIds = this.sections.map(s => s.section_id);
    const populatedSections = await Section.find({ section_id: { $in: sectionIds } });

    // Create a map for quick lookup
    const sectionMap = populatedSections.reduce((map, section) => {
        map[section.section_id] = section;
        return map;
    }, {});

    // Replace section_id with actual section data while maintaining order
    this.sections = this.sections.map(sectionRef => ({
        order: sectionRef.order,
        section_id: sectionMap[sectionRef.section_id] || sectionRef.section_id
    }));

    return this;
};

module.exports = mongoose.model("Page", PageSchema);