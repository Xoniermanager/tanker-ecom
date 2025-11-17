
class BaseRepository {
    constructor(model) {
        if (!model) throw new Error("Model is required for the repository");
        this.model = model;
    }

    
    async create(data, session = null) {
        const doc = new this.model(data);
        return await doc.save({ session });
    }

    
    async bulkCreate(docs, session = null) {
        return await this.model.insertMany(docs, {ordered: false, session });
    }

    
    async findById(id, session = null, projection = null) {
        const query = this.model.findById(id, projection);
        if (session) query.session(session);
        return await query;
    }

   
    async findOne(queryObj, projection = null, session = null) {
        const query = this.model.findOne(queryObj, projection);
        if (session) query.session(session);
        return await query;
    }

   
    async findAll(filter = {}, projection = null, sort = null, session = null) {
        const query = this.model.find(filter, projection).sort(sort);
        if (session) query.session(session);
        return await query;
    }

    
    async update(id, updateData, session = null) {
        return await this.model.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true, runValidators: true, session }
        );
    }

    async findByIdAndUpdate(id, data, session = null){
        const result = await this.model.findByIdAndUpdate({ _id: id },
            { $set: data },
            { new: true, runValidators: true, session })
        
            return result
    }

   
    async deleteById(id, session = null) {
        const doc = await this.findById(id, session);
        if (!doc) throw new Error(`Document with ID ${id} not found.`);
        await this.model.deleteOne({ _id: id }).session(session);
        return doc;
    }

    
    async exists(queryObj, session = null) {
        const query = this.model.exists(queryObj);
        if (session) query.session(session);
        return await query;
    }

   
    async count(filter = {}, session = null) {
        const query = this.model.countDocuments(filter);
        if (session) query.session(session);
        return await query;
    }

   
    async paginate(
        filter = {},
        page = 1,
        limit = 10,
        sort = null,
        session = null,
        projection = null,
        populateOptions = null
    ) {
        const skip = (page - 1) * limit;
        let query = this.model
            .find(filter, projection)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        if (populateOptions) {
            if (Array.isArray(populateOptions)) {
                populateOptions.forEach(option => {
                    query = query.populate(option);
                });
            } else {
                query = query.populate(populateOptions);
            }
        }

        if (session) query.session(session);

        const [docs, total] = await Promise.all([
            query,
            this.count(filter, session)
        ]);

        const data = docs.map(doc => doc.toJSON());
        const totalPages = Math.ceil(total / limit);

        return { data, total, page, limit, totalPages };
    }

    
    async bulkDelete(ids = [], session = null) {
        if (!Array.isArray(ids) || ids.length === 0) return { deletedCount: 0 };

        const result = await this.model.deleteMany(
            { _id: { $in: ids } },
            { session }
        );

        return result;
    }

    /**
     * Executes bulk write operations on the Inventory collection.
     *
     * This is useful when you need to perform multiple update/insert/delete operations
     * in a single database call (e.g., updating quantities of multiple products
     * after checkout).
     *
     * @param {Array<Object>} operations - Array of bulk operations (updateOne, insertOne, deleteOne).
     *   Example:
     *   [
     *     {
     *       updateOne: {
     *         filter: { product: ObjectId("...") },
     *         update: { $inc: { quantity: -2 } }
     *       }
     *     },
     *     {
     *       updateOne: {
     *         filter: { product: ObjectId("...") },
     *         update: { $inc: { quantity: -1 } }
     *       }
     *     }
     *   ]
     *
     * @param {mongoose.ClientSession} session - The current transaction session.
     *
     * @returns {Promise<Object>} Result of the bulkWrite operation containing:
     */
    async bulkWrite(operations, session) {
        return Inventory.bulkWrite(operations, { session });
    }

  
}

module.exports = BaseRepository;
