const galleryService = require("../services/gallery.service");
const customError = require("../utils/error");
const customResponse = require("../utils/response");
const { uploadImage } = require("../utils/storage");

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
            const items = req.body.items || "[]";
            const files = req.files || [];

            // Build a map of clientId -> file using fieldname pattern: files[item-123]
            const filesMap = {};
            for (const file of files) {
                const match = file.fieldname.match(/^files\[(.+?)\]$/); // files[item-123]  throw customError("User not found", 400);
                if (match) {
                    const clientId = match[1];
                    filesMap[clientId] = file;
                }
            }

            // Check if every item has a corresponding uploaded file
            const missingFiles = [];
            for (const item of items) {
                if (!item.clientId || !filesMap[item.clientId]) {
                    missingFiles.push(item.title);
                }
            }

            // Abort if any item is missing its file
            if (missingFiles.length > 0) {
                throw customError("File(s) are for: " + missingFiles.join(", "), 400);
            }

            // All items have files — proceed with uploading and assigning image data
            for (let item of items) {
                if (item.clientId && filesMap[item.clientId]) {
                    const file = filesMap[item.clientId];
                    const source = await uploadImage(file.buffer, file.originalname, "uploads/blog-thumbnails")
                    item.image = {
                        type: "image",
                        source: source.url,
                    };
                }
            }

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
            const items = req.body.items || "[]";
            const files = req.files || [];

            // Build a map of clientId -> file using fieldname pattern: files[item-123]
            const filesMap = {};
            for (const file of files) {
                const match = file.fieldname.match(/^files\[(.+?)\]$/); // files[item-123]  throw customError("User not found", 400);
                if (match) {
                    const clientId = match[1];
                    filesMap[clientId] = file;
                }
            }

            // Proceed with uploading and assigning image data
            for (let item of items) {
                if (item.clientId && filesMap[item.clientId]) {
                    const file = filesMap[item.clientId];
                    const source = await uploadImage(file.buffer, file.originalname, "uploads/blog-thumbnails")
                    item.image = {
                        type: "image",
                        source: source.url,
                    };
                }
            }

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

    updateGalleryItemStatus = async (req, res, next) => {
        try {
            const itemId = req.params.id;
            const status = await galleryService.updateGalleryItemStatus(itemId);
            customResponse(res, `Gallery item status changes to ${status} successfully`, null);
        } catch (error) {
            next(error);
        }
    };
}

exports.GalleryController = GalleryController;
