const Page = require("../../models/cms/pages.model");
const BaseRepository = require("../base.repository");
const Section = require("../../models/cms/section.model");

/**
 * Repository for managing pages.
 */
class PageRepository extends BaseRepository {
    constructor() {
        super(Page);
    }

    async findByPageId(pageId, session = null) {
        const page = await this.model.findOne({ pageId }).session(session);
        if (!page) return null;

        const sectionIds = page.sections.map(s => s.section_id);
        const sections = await Section.find({ section_id: { $in: sectionIds } }).session(session);

        // Create a map: { section_id => sectionData }
        const sectionMap = sections.reduce((map, section) => {
            map[section.section_id] = section.toObject();
            return map;
        }, {});

        // Build enriched sections
        const enrichedSections = page.sections.map(sectionRef => {
            const data = sectionMap[sectionRef.section_id];
            return data
                ? {
                    order: sectionRef.order,
                    section_id: sectionRef.section_id,
                    heading: data.heading,
                    subheading: data.subheading,
                    thumbnail: data.thumbnail || undefined,
                    contents: data.contents || []
                }
                : sectionRef.toObject();
        });

        return {
            ...page.toObject(),
            sections: enrichedSections
        };
    }

    async upsertPage(pageId, data, session = null) {
        return this.model.findOneAndUpdate(
            { pageId },
            { $set: data },
            { new: true, upsert: true, session }
        );
    }
}

module.exports = new PageRepository();
