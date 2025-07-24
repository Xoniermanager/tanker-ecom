const mongoose = require("mongoose");
const pageRepository = require("../repositories/cms/page.repository");
const sectionRepository = require("../repositories/cms/section.repository");
const customError = require("../utils/error");

/**
 * CMS Service handles creating, updating, and retrieving Pages and Sections.
 */
class CmsService {
    /**
     * Get all pages.
     * @returns {Promise<Object>}
     */
    async getPages() {
        const page = await pageRepository.findAll();
        return page;
    }

    /**
     * Get a page with populated sections.
     * @param {String} pageId 
     * @returns {Promise<Object>}
     */
    async getPage(pageId) {
        const page = await pageRepository.findByPageId(pageId);
        if (!page) throw customError("Page not found", 404);
        return page;
    }

    /**
     * Create or update a page and optionally its sections.
     * @param {String} pageId 
     * @param {Object} seo 
     * @param {Array<Object>} sections 
     * @returns {Promise<Object>}
     */
    async upsertPageWithSections(pageId, seo, sections = []) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            // Upsert each section
            const sectionRefs = [];
            for (const section of sections) {
                const { section_id, ...data } = section;
                const upserted = await sectionRepository.upsertSection(section_id, data, session);
                sectionRefs.push({ section_id: upserted.section_id, order: section.order });
            }

            // Upsert the page with section refs
            const page = await pageRepository.upsertPage(pageId, {
                seo,
                sections: sectionRefs,
            }, session);

            await session.commitTransaction();
            return page;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Update a single section by section_id.
     * @param {String} sectionId 
     * @param {Object} updateData 
     * @returns {Promise<Object>}
     */
    async updateSection(sectionId, updateData) {
        const updated = await sectionRepository.upsertSection(sectionId, updateData);
        if (!updated) throw customError("Section not found", 404);
        return updated;
    }

    /**
     * Get a single section.
     * @param {String} sectionId 
     * @returns {Promise<Object>}
     */
    async getSection(sectionId) {
        const section = await sectionRepository.findBySectionId(sectionId);
        if (!section) throw customError("Section not found", 404);
        return section;
    }
}

module.exports = new CmsService();
