const express = require("express");
const { TestimonialController } = require("../controllers/testimonial.controller");
const authorize = require("../middlewares/auth");
const { validateTestimonial } = require("../middlewares/validation");

const router = express.Router();
const testimonialController = new TestimonialController();

// ==================== Testimonial Routes ====================

router.get("/", authorize(["admin"]), testimonialController.getAllTestimonials);
router.get("/frontend", testimonialController.getFrontendTestimonials);
router.get("/:id", authorize(["admin"]), testimonialController.getTestimonialById);
router.post("/", authorize(["admin"]), validateTestimonial, testimonialController.createTestimonial);
router.put("/:id", authorize(["admin"]), validateTestimonial, testimonialController.updateTestimonial);
router.delete("/:id", authorize(["admin"]), testimonialController.deleteTestimonial);
router.patch("/:id/status", authorize(["admin"]), testimonialController.updateTestimonialStatus);

module.exports = router;
