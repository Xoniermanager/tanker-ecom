const testimonialService = require("../services/testimonial.service");
const customError = require("../utils/error");
const customResponse = require("../utils/response");

class TestimonialController {
   
    getAllTestimonials = async (req, res, next) => {
        try {
            const testimonials = await testimonialService.getAllTestimonials();
            customResponse(res, "All testimonials fetched successfully", testimonials);
        } catch (error) {
            next(error);
        }
    };

    
    getFrontendTestimonials = async (req, res, next) => {
        try {
            const testimonials = await testimonialService.getFrontendTestimonials({ status: "active" }, 3);
            customResponse(res, "All testimonials fetched successfully", testimonials);
        } catch (error) {
            next(error);
        }
    };

    
    createTestimonial = async (req, res, next) => {
        try {
            const data = req.body;
            const testimonial = await testimonialService.createTestimonial(data);
            customResponse(res, "Testimonial created successfully", testimonial);
        } catch (error) {
            next(error);
        }
    };

    
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

    
    bulkDeleteTestimonials = async (req, res, next) => {
        try {
            const { ids = [] } = req.body;
            const result = await testimonialService.bulkDeleteTestimonials(ids);
            customResponse(res, "Testimonials deleted successfully", result);
        } catch (error) {
            next(error);
        }
    };

   
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
