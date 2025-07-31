const express = require("express");
const { GalleryController } = require("../controllers/gallery.controller");
const authorize = require("../middlewares/auth");
const {
    validateBulkDeleteGalleryItems,
    validateBulkInsertUpdateGalleryItems
} = require("../middlewares/validation");
const upload = require("../config/multer");

const router = express.Router();
const galleryController = new GalleryController();

// ==================== Gallery Routes ====================
router.get("/", galleryController.getGallery);
router.post(
    "/",
    authorize(['admin']),
    upload.any(),
    validateBulkInsertUpdateGalleryItems,
    galleryController.addGalleryItems
);
router.put(
    "/",
    authorize(['admin']),
    upload.any(),
    validateBulkInsertUpdateGalleryItems,
    galleryController.updateGalleryItems
);
router.delete(
    "/",
    authorize(['admin']),
    validateBulkDeleteGalleryItems,
    galleryController.deleteGalleryItems
);
router.patch(
    "/:id/status",
    authorize(['admin']),
    galleryController.updateGalleryItemStatus
);

module.exports = router;
