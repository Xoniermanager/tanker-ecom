/**
 * BaseRepository class for performing common CRUD operations on a MongoDB model.
 */
class BaseRepository {
    constructor(model) {
        if (!model) throw new Error("Model is required for the repository");
        this.model = model;
    }

    /**
     * Creates a new document.
     * @param {Object} data - The data to be saved.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object>} - The created document.
     */
    async create(data, session = null) {
        const doc = new this.model(data);
        return await doc.save({ session });
    }

    /**
     * Inserts multiple documents in bulk.
     * @param {Array<Object>} docs - Array of documents to insert.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Array<Object>>} - The inserted documents.
     */
    async bulkCreate(docs, session = null) {
        return await this.model.insertMany(docs, { session });
    }

    /**
     * Finds a document by its ID.
     * @param {String} id - The document ID.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @param {Object|null} [projection=null] - Fields to return.
     * @returns {Promise<Object|null>} - The found document or null.
     */
    async findById(id, session = null, projection = null) {
        const query = this.model.findById(id, projection);
        if (session) query.session(session);
        return await query;
    }

    /**
     * Finds a single document matching the given query.
     * @param {Object} queryObj - MongoDB query object.
     * @param {Object|null} [projection=null] - Fields to return.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object|null>} - The found document or null.
     */
    async findOne(queryObj, projection = null, session = null) {
        const query = this.model.findOne(queryObj, projection);
        if (session) query.session(session);
        return await query;
    }

    /**
     * Finds all documents matching a filter.
     * @param {Object} [filter={}] - MongoDB query filter.
     * @param {Object|null} [projection=null] - Fields to return.
     * @param {Object|null} [sort=null] - Sorting object.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Array<Object>>} - Array of matching documents.
     */
    async findAll(filter = {}, projection = null, sort = null, session = null) {
        const query = this.model.find(filter, projection).sort(sort);
        if (session) query.session(session);
        return await query;
    }

    /**
     * Updates a document by its ID.
     * @param {String} id - Document ID to update.
     * @param {Object} updateData - Fields to update.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object|null>} - The updated document or null.
     */
    async update(id, updateData, session = null) {
        return await this.model.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true, runValidators: true, session }
        );
    }

    /**
     * Deletes a document by ID.
     * @param {String} id - Document ID to delete.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object>} - The deleted document.
     * @throws {Error} - If document not found.
     */
    async deleteById(id, session = null) {
        const doc = await this.findById(id, session);
        if (!doc) throw new Error(`Document with ID ${id} not found.`);
        await this.model.deleteOne({ _id: id }).session(session);
        return doc;
    }

    /**
     * Checks if a document exists that matches the query.
     * @param {Object} queryObj - MongoDB query object.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<boolean>} - True if document exists, false otherwise.
     */
    async exists(queryObj, session = null) {
        const query = this.model.exists(queryObj);
        if (session) query.session(session);
        return await query;
    }

    /**
     * Counts documents matching a filter.
     * @param {Object} [filter={}] - MongoDB query filter.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<number>} - Number of matching documents.
     */
    async count(filter = {}, session = null) {
        const query = this.model.countDocuments(filter);
        if (session) query.session(session);
        return await query;
    }

    /**
     * Retrieves paginated documents matching a filter.
     * @param {Object} [filter={}] - MongoDB query filter.
     * @param {number} [page=1] - Current page number.
     * @param {number} [limit=10] - Number of documents per page.
     * @param {Object|null} [sort=null] - Sorting object.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @param {String|Object} [projection=null] - Fields to include or exclude.
     * @returns {Promise<{ data: Array<Object>, total: number, page: number, limit: number }>}
     */
    async paginate(filter = {}, page = 1, limit = 10, sort = null, session = null, projection = null) {
        console.log(projection);

        const skip = (page - 1) * limit;
        const query = this.model
            .find(filter, projection)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        if (session) query.session(session);

        const [data, total] = await Promise.all([
            query,
            this.count(filter, session)
        ]);

        return { data, total, page, limit };
    }

    /**
    * Deletes multiple items by their IDs.
    * @param {string[]} ids - Array of item IDs to delete.
    * @param {mongoose.ClientSession} [session=null] - Optional mongoose session for transaction support.
    * @returns {Promise<Object>} Result of the bulk delete operation.
    */
    async bulkDelete(ids = [], session = null) {
        if (!Array.isArray(ids) || ids.length === 0) return { deletedCount: 0 };

        const result = await this.model.deleteMany(
            { _id: { $in: ids } },
            { session }
        );

        return result;
    }
}

module.exports = BaseRepository;
