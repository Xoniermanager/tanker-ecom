const SiteSetting = require("../models/SiteSetting");
const siteSettingRepository = require("../repositories/siteSetting.repository");
const customError = require("../utils/error");
const mongoose = require("mongoose");

/**
 * SiteSettingService handles reading and updating site settings.
 */
class SiteSettingService {
    /**
     * Returns the current site settings.
     * @returns {Promise<Object|null>}
     */
    async getCurrentSettings() {
        const settings = await siteSettingRepository.getCurrentSettings();
        if (!settings) {
            throw customError("Site settings not found", 404);
        }
        return settings;
    }

    /**
     * Updates or creates the site settings document.
     * @param {Object} updateData - The updated site settings payload.
     * @returns {Promise<Object>} - The updated site settings.
     */
    async upsertSettings(updateData) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const updated = await siteSettingRepository.upsertSettings(updateData, session);

            await session.commitTransaction();
            return updated;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    updateLogo = async (logoUrl) => {
        const settings = await SiteSetting.findOneAndUpdate({}, {
            $set: { "siteDetails.logo": logoUrl },
        }, { new: true, upsert: true });

        return settings;
    };
}

module.exports = new SiteSettingService();
