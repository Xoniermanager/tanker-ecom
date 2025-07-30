const galleryService = require("../services/gallery.service");
const customResponse = require("../utils/response");

class GalleryController {
    /**
     * Get all gallery items.
     */
    getGallery = async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const gallery = await galleryService.getGallery(page, limit);
            customResponse(res, "Gallery items fetched successfully", gallery);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get gallery items filtered by tag.
     */
    getGalleryByTags = async (req, res, next) => {
        try {
            const { tags = [], page = 1, limit = 10 } = req.query;
            const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
            const gallery = await galleryService.getGalleryFilteredByTag(tagsArray, page, limit);
            customResponse(res, "Filtered gallery items fetched successfully", gallery);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Add gallery items (bulk create).
     */
    addGalleryItems = async (req, res, next) => {
        try {
            let items = req.body.items || [];

            const result = await galleryService.upsertGalleryBulk(items, []);
            customResponse(res, "Gallery items inserted successfully", result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update gallery items (bulk create).
     */
    updateGalleryItems = async (req, res, next) => {
        try {
            let items = req.body.items || [];
            const result = await galleryService.upsertGalleryBulk([], items);
            customResponse(res, "Gallery items updated successfully", result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete gallery items in bulk by IDs.
     */
    deleteGalleryItems = async (req, res, next) => {
        try {
            const { ids = [] } = req.body;
            const result = await galleryService.bulkDeleteGallery(ids);
            customResponse(res, "Gallery items deleted successfully", result);
        } catch (error) {
            next(error);
        }
    };
}

exports.GalleryController = GalleryController;
