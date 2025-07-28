const Gallery = require("../../models/cms/gallery.model");
const BaseRepository = require("../base.repository");
const { getPublicFileUrl } = require("../../utils/storage");

/**
 * Repository for managing gallery items.
 */
class GalleryRepository extends BaseRepository {
    constructor() {
        super(Gallery);
    }

    /**
     * Bulk creates and updates documents in the database.
     *
     * @param {Array<Object>} createItems - Documents to be inserted. Must not include _id.
     * @param {Array<Object>} updateItems - Documents to be updated. Must include _id.
     * @param {ClientSession|null} session - Optional MongoDB session for transactional support.
     *
     * @returns {Promise<BulkWriteResult>} Result of the bulkWrite operation.
     */
    async bulkCreateOrUpdate(createItems = [], updateItems = [], session = null) {
        let finalIds = [];

        // Handle create items
        if (createItems.length) {
            const createOps = createItems.map(item => ({
                insertOne: { document: item }
            }));

            const createResult = await this.model.bulkWrite(createOps, { session });
            const insertedIds = Object.values(createResult.insertedIds);
            finalIds.push(...insertedIds);
        }

        // Handle update items
        if (updateItems.length) {
            const updateOps = updateItems.map(item => ({
                updateOne: {
                    filter: { _id: item._id },
                    update: { $set: item },
                    upsert: true,
                }
            }));

            const updateResult = await this.model.bulkWrite(updateOps, { session });

            const updatedIds = updateItems.map(item => item._id);
            const upsertedIds = Object.values(updateResult.upsertedIds);

            finalIds.push(...updatedIds, ...upsertedIds);
        }

        return this.model.find({ _id: { $in: finalIds } }).session(session);
    }

}

module.exports = new GalleryRepository();
