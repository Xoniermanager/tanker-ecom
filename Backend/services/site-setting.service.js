const SiteSetting = require("../models/site-setting.model");
const siteSettingRepository = require("../repositories/site-setting.repository");
const customError = require("../utils/error");
const mongoose = require("mongoose");


class SiteSettingService {
   
    async getCurrentSettings() {
        const settings = await siteSettingRepository.getCurrentSettings();
        if (!settings) {
            throw customError("Site settings not found", 404);
        }
        return settings;
    }

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
