const testimonialService = require("../services/testimonial.service");
const customError = require("../utils/error");
const customResponse = require("../utils/response");

class TestimonialController {
    /**
     * Get all testimonials (unpaginated).
     */
    getAllTestimonials = async (req, res, next) => {
        try {
            const testimonials = await testimonialService.getAllTestimonials();
            customResponse(res, "All testimonials fetched successfully", testimonials);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all testimonials (unpaginated) for frontend (only active one).
     */
    getFrontendTestimonials = async (req, res, next) => {
        try {
            const testimonials = await testimonialService.getAllTestimonials({ status: "active" }, 3);
            customResponse(res, "All testimonials fetched successfully", testimonials);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a new testimonial.
     */
    createTestimonial = async (req, res, next) => {
        try {
            const data = req.body;
            const testimonial = await testimonialService.createTestimonial(data);
            customResponse(res, "Testimonial created successfully", testimonial);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get a testimonial by ID.
     */
    getTestimonialById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const testimonial = await testimonialService.getTestimonialById(id);
            if (!testimonial) throw customError("Testimonial not found", 404);
            customResponse(res, "Testimonial fetched successfully", testimonial);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update a testimonial by ID.
     */
    updateTestimonial = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updated = await testimonialService.updateTestimonial(id, data);
            if (!updated) throw customError("Testimonial not found", 404);
            customResponse(res, "Testimonial updated successfully", updated);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete a testimonial by ID.
     */
    deleteTestimonial = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await testimonialService.deleteTestimonial(id);
            if (!result) throw customError("Testimonial not found", 404);
            customResponse(res, "Testimonial deleted successfully", result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Bulk delete testimonials by IDs.
     */
    bulkDeleteTestimonials = async (req, res, next) => {
        try {
            const { ids = [] } = req.body;
            const result = await testimonialService.bulkDeleteTestimonials(ids);
            customResponse(res, "Testimonials deleted successfully", result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Toggle testimonial status (active/inactive).
     */
    updateTestimonialStatus = async (req, res, next) => {
        try {
            const testimonialId = req.params.id;
            
            const status = await testimonialService.updateTestimonialStatus(testimonialId);
            customResponse(res, `Testimonial status changed to ${status} successfully`, null);
        } catch (error) {
            next(error);
        }
    };
}

exports.TestimonialController = TestimonialController;
