const siteSettingService = require("../services/site-setting.service");
const customResponse = require("../utils/response");
const { uploadImage } = require("../utils/storage");

class SiteSettingController {
    /**
     * Fetch the current site settings.
     */
    getCurrentSettings = async (req, res, next) => {
        try {
            const result = await siteSettingService.getCurrentSettings();
            customResponse(res, "Site settings fetched successfully.", result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update or create the site settings.
     */
    upsertSettings = async (req, res, next) => {
        try {
            const updateData = req.body;
            

            if (req.file) {
                const uploadedUrl = await uploadImage(req.file, "site-settings");
                updateData.logo = uploadedUrl;
            }

            const updated = await siteSettingService.upsertSettings(updateData);
            customResponse(res, "Site settings updated successfully.", updated);
        } catch (error) {
            next(error);
        }
    };

    uploadLogo = async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Logo file is required." });
            }

            const logoUrl = await uploadImage(req.file.buffer, req.file.originalname, "uploads", req.file.mimetype);
            const updatedSetting = await siteSettingService.updateLogo(logoUrl);

            customResponse(res, "Logo uploaded successfully", updatedSetting);
        } catch (err) {
            next(err);
        }
    };
}

exports.SiteSettingController = SiteSettingController;
