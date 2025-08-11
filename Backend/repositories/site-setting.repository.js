const SiteSetting = require("../models/site-setting.model");
const BaseRepository = require("./base.repository");

/**
 * Repository class for interacting with the SiteSetting collection.
 */
class SiteSettingRepository extends BaseRepository {
    constructor() {
        super(SiteSetting);
    }

    /**
     * Gets the current site setting (assuming single entry).
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object|null>}
     */
    async getCurrentSettings(session = null) {
        return this.model.findOne().session(session);
    }

    /**
     * Updates the current site setting.
     * If no setting exists, it creates one.
     * @param {Object} data - New setting data.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object>} - Updated or created site setting.
     */
    async upsertSettings(data, session = null) {
        return this.model.findOneAndUpdate(
            {},
            { $set: data },
            { new: true, upsert: true, session }
        );
    }
}

module.exports = new SiteSettingRepository();