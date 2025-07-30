const express = require("express");
const { GalleryController } = require("../controllers/gallery.controller");
const authorize = require("../middlewares/auth");
const {
    validateBulkInsertGalleryItems,
    validateBulkUpdateGalleryItems,
    validateBulkDeleteGalleryItems
} = require("../middlewares/validation");

const router = express.Router();
const galleryController = new GalleryController();

// ==================== Gallery Routes ====================
router.get("/", authorize(['admin']), galleryController.getGallery);
router.post(
    "/",
    authorize(['admin']),
    validateBulkInsertGalleryItems,
    galleryController.addGalleryItems
);
router.put(
    "/",
    authorize(['admin']),
    validateBulkUpdateGalleryItems,
    galleryController.updateGalleryItems
);
router.delete(
    "/",
    authorize(['admin']),
    validateBulkDeleteGalleryItems,
    galleryController.deleteGalleryItems
);

module.exports = router;
