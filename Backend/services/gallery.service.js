const mongoose = require("mongoose");
const galleryRepository = require("../repositories/cms/gallery.repository");
const { deleteImage, getBucketImageKey } = require("../utils/storage");
const customError = require("../utils/error");

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
    async getGallery(page = 1, limit = 10, filters = {}) {
        return await galleryRepository.paginate({ ...filters }, page, limit, { createdAt: -1 }, null);
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

   
    async bulkDeleteGallery(ids = []) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const result = await galleryRepository.bulkDelete(ids, session);

            for (const id of ids) {
                const item = await galleryRepository.findById(id);
                const key = getBucketImageKey(item.image.source)
                await deleteImage(key);
            }

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
     * Toggles the status of a gallery item between 'active' and 'inactive'.
     *
     * @param {string} itemId - The ID of the gallery item to update.
     * @returns {Promise<string>} The updated status of the gallery item ('active' or 'inactive').
     */
    async updateGalleryItemStatus(itemId) {
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            throw customError("Invalid gallery item ID");
        }

        const item = await galleryRepository.findById(itemId);
        if (!item) {
            throw customError("Gallery item not found");
        }

        const newStatus = item.status === 'active' ? 'inactive' : 'active';
        item.status = newStatus;
        await item.save();

        return newStatus;
    }
}

module.exports = new GalleryService();
