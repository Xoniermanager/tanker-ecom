const mongoose = require("mongoose");
const galleryRepository = require("../repositories/cms/gallery.repository");

/**
 * Service for managing gallery items.
 */
class GalleryService {
    /**
     * Retrieves a paginated list of all gallery items.
     * @param {number} page - Page number for pagination.
     * @param {number} limit - Number of items per page.
     * @returns {Promise<Object>} Paginated gallery items.
     */
    async getGallery(page = 1, limit = 10) {
        return await galleryRepository.paginate({}, page, limit, { createdAt: -1 }, null);
    }

    /**
     * Retrieves paginated gallery items filtered by matching tags.
     * @param {string[]} tags - Tags to filter gallery items.
     * @param {number} page - Page number for pagination.
     * @param {number} limit - Number of items per page.
     * @returns {Promise<Object>} Paginated filtered gallery items.
     */
    async getGalleryFilteredByTag(tags, page = 1, limit = 10) {
        return await galleryRepository.paginate(
            { tags: { $in: tags } },
            page,
            limit,
            { createdAt: -1 },
            null
        );
    }

    /**
     * Bulk upserts (create or update) multiple gallery items.
     * @param {Array<Object>} createItems - Documents to be inserted.
     * @param {Array<Object>} updateItems - Documents to be updated.
     * @returns {Promise<Array<Object>>} Array of upserted items.
     */
    async upsertGalleryBulk(createItems = [], updateItems = []) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const result = await galleryRepository.bulkCreateOrUpdate(createItems, updateItems, session);

            await session.commitTransaction();
            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Bulk deletes gallery items by their IDs.
     * @param {string[]} ids - Array of gallery item IDs to delete.
     * @returns {Promise<Object>} Deletion result with count.
     */
    async bulkDeleteGallery(ids = []) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const result = await galleryRepository.bulkDelete(ids, session);

            await session.commitTransaction();
            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new GalleryService();
