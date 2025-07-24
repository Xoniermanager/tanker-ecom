const Section = require("../../models/cms/section.model");
const { getPublicFileUrl } = require("../../utils/storage");
const BaseRepository = require("../base.repository");

/**
 * Repository for managing sections.
 */
class SectionRepository extends BaseRepository {
    constructor() {
        super(Section);
    }

    /**
     * Find a section by section_id
     * @param {String} sectionId 
     * @param {Object|null} session 
     * @returns {Promise<Object|null>}
     */
    async findBySectionId(sectionId, session = null) {
        const section = await this.model.findOne({ section_id: sectionId }).session(session);
        if (!section) return null;

        const sectionObj = section.toObject();

        if (sectionObj.thumbnail && sectionObj.thumbnail.source) {
            sectionObj.thumbnail.fullPath = getPublicFileUrl(sectionObj.thumbnail.source);
        }

        return sectionObj;
    }

    /**
     * Update or create a section by section_id
     * @param {String} sectionId 
     * @param {Object} data 
     * @param {Object|null} session 
     * @returns {Promise<Object>}
     */
    async upsertSection(sectionId, data, session = null) {
        return this.model.findOneAndUpdate(
            { section_id: sectionId },
            { $set: data },
            { new: true, upsert: true, session }
        );
    }
}

module.exports = new SectionRepository();
