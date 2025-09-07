const Contact = require("../models/contact.model");
const BaseRepository = require("./base.repository");

/**
 * Repository class for interacting with the Contact collection.
 */
class ContactRepository extends BaseRepository {
    constructor() {
        super(Contact);
    }

    getTotalQuery = async (startDate, endDate, session = null) => {
        try {
            const query = {};
            
            
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            
            const options = session ? { session } : {};
            const totalQueries = await this.model.countDocuments(query, options);
            
            return totalQueries;
        } catch (error) {
            throw new Error(`Error fetching total queries: ${error.message}`);
        }
    };
}


module.exports = new ContactRepository();
