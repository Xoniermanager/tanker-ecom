const cmsService = require("../services/cms.service");
const customResponse = require("../utils/response");
const { uploadImage } = require("../utils/storage");

class CmsController {
    /**
     * Get all Pages.
     */
    getPages = async (req, res, next) => {
        try {
            const page = await cmsService.getPages();
            customResponse(res, "Pages fetched successfully", page);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get a page by pageId with its sections populated.
     */
    getPage = async (req, res, next) => {
        try {
            const { pageId } = req.params;
            const page = await cmsService.getPage(pageId);
            customResponse(res, "Page fetched successfully", page);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create or update a page and its sections.
     */
    upsertPageWithSections = async (req, res, next) => {
        try {
            const { pageId } = req.params;
            

            const { seo, sections } = req.body;

            const updatedPage = await cmsService.upsertPageWithSections(pageId, seo, sections);
            customResponse(res, "Page and sections updated successfully", updatedPage);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get a specific section by section_id.
     */
    getSection = async (req, res, next) => {
        try {
            const { sectionId } = req.params;
            const section = await cmsService.getSection(sectionId);
            customResponse(res, "Section fetched successfully", section);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update a specific section.
     */
    updateSection = async (req, res, next) => {
        try {
            const { sectionId } = req.params;
            const updateData = req.body;

            if (req.file) {
                const thumbnailUrl = await uploadImage(req.file, "section-thumbnails");
                updateData.thumbnail = {
                    type: "image",
                    source: thumbnailUrl,
                };
            }

            const updatedSection = await cmsService.updateSection(sectionId, updateData);
            customResponse(res, "Section updated successfully", updatedSection);
        } catch (error) {
            next(error);
        }
    };
}

exports.CmsController = CmsController;
