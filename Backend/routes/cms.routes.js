const express = require("express");
const upload = require("../config/multer");
const { CmsController } = require("../controllers/cms.controller");
const {
    validateUpsertPageWithSections,
    validateUpdateSection,
} = require("../middlewares/validation");

const router = express.Router();
const cmsController = new CmsController();

// ==================== CMS Routes ====================
router.get("/pages", cmsController.getPages);
router.get("/pages/:pageId", cmsController.getPage);
router.put("/pages/:pageId", validateUpsertPageWithSections, cmsController.upsertPageWithSections);
router.get("/sections/:sectionId", cmsController.getSection);
router.put("/sections/:sectionId", validateUpdateSection, cmsController.updateSection);

module.exports = router;
