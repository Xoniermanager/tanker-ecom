const express = require("express");
const upload = require("../config/multer");
const { SiteSettingController } = require("../controllers/site-setting.controller");
const {
    validateSiteSetting,
} = require("../middlewares/validation");

const router = express.Router();
const siteSettingController = new SiteSettingController();

// ==================== Site Setting Routes ====================

router.get("/", siteSettingController.getCurrentSettings);
router.put("/", validateSiteSetting, siteSettingController.upsertSettings);
router.put("/logo", upload.single("logo"), siteSettingController.uploadLogo);

module.exports = router;
