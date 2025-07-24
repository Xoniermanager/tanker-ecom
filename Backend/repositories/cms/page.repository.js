const Page = require("../../models/cms/pages.model");
const BaseRepository = require("../base.repository");
const Section = require("../../models/cms/section.model");
const { getPublicFileUrl } = require("../../utils/storage");

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
            if (!data) return sectionRef.toObject();

            let thumbnail = undefined;
            if (data.thumbnail && data.thumbnail.source) {
                thumbnail = {
                    ...data.thumbnail,
                    fullPath: getPublicFileUrl(data.thumbnail.source),
                };
            }

            return {
                order: sectionRef.order,
                section_id: sectionRef.section_id,
                heading: data.heading,
                subheading: data.subheading,
                thumbnail,
                contents: data.contents || []
            };
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
