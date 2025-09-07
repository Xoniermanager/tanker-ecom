const express = require("express");
const { ContactController } = require("../controllers/contact.controller");
const { validateContact } = require("../middlewares/validation");
const authorize = require("../middlewares/auth");

const router = express.Router();
const contactController = new ContactController();

// ==================== Contact Routes ====================
router.post("/", validateContact, contactController.submitContact);
router.get("/", authorize(['admin']), contactController.getAllContacts);
router.get("/detail/:id", authorize(['admin']), contactController.getContactsById);
router.delete("/:id", authorize(['admin']), contactController.deleteContact);

module.exports = router;
