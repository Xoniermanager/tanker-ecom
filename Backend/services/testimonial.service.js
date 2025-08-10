const mongoose = require("mongoose");
const testimonialRepository = require("../repositories/cms/testimonial.repository");
const customError = require("../utils/error");

/**
 * Service for managing testimonials.
 */
class TestimonialService {
    /**
     * Retrieves all testimonials.
     * @param {Object} filters - Filter conditions.
     * @returns {Promise<Array>} List of all testimonials.
     */
    async getAllTestimonials(filters, limit = 3) {
        const testimonialData =  await testimonialRepository.findAll(filters, null , {createdAt: -1});

        return testimonialData.slice(0,Number(limit))
    }

    /**
     * Retrieves paginated testimonials with optional filters.
     * @param {Object} filters - Filter conditions.
     * @param {number} page - Page number for pagination.
     * @param {number} limit - Number of items per page.
     * @returns {Promise<Object>} Paginated testimonials.
     */
    async getPaginatedTestimonials(filters = {}, page = 1, limit = 10) {
        return await testimonialRepository.paginate(filters, page, limit, { createdAt: -1 });
    }

    /**
     * Creates a new testimonial entry.
     * @param {Object} data - Testimonial data.
     * @param {string} data.name - Name of the person giving testimonial.
     * @param {string} data.designation - Designation of the person.
     * @param {string} data.message - Message of the testimonial.
     * @param {string} [data.status] - Status of the testimonial (active/inactive).
     * @returns {Promise<Object>} Created testimonial.
     */
    async createTestimonial(data) {
        return await testimonialRepository.create(data);
    }

    /**
     * Retrieves a testimonial by its ID.
     * @param {string} id - The ID of the testimonial.
     * @returns {Promise<Object|null>} The testimonial, or null if not found.
     */
    async getTestimonialById(id) {
        return await testimonialRepository.findById(id);
    }

    /**
     * Updates an existing testimonial by its ID.
     * @param {string} id - The ID of the testimonial to update.
     * @param {Object} data - Updated testimonial data.
     * @returns {Promise<Object|null>} Updated testimonial, or null if not found.
     */
    async updateTestimonial(id, data) {
        return await testimonialRepository.update(id, data);
    }

    /**
     * Deletes a testimonial by its ID.
     * @param {string} id - The ID of the testimonial to delete.
     * @returns {Promise<Object|null>} Deleted testimonial, or null if not found.
     */
    async deleteTestimonial(id) {
        return await testimonialRepository.deleteById(id);
    }

    /**
     * Deletes multiple testimonials by their IDs.
     * @param {string[]} ids - Array of testimonial IDs to delete.
     * @returns {Promise<Object>} Result of bulk deletion.
     */
    async bulkDeleteTestimonials(ids) {
        return await testimonialRepository.bulkDelete(ids);
    }

    /**
     * Toggles the status of a testimonial between 'active' and 'inactive'.
     * @param {string} testimonialId - The ID of the testimonial to update.
     * @returns {Promise<string>} The updated status.
     * @throws {Error} If the testimonial ID is invalid or not found.
     */
    async updateTestimonialStatus(testimonialId) {
        if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
            throw customError("Invalid testimonial ID", 400);
        }

        const testimonial = await testimonialRepository.findById(testimonialId);
        if (!testimonial) {
            throw customError("Testimonial not found", 404);
        }

        const newStatus = testimonial.status === 'active' ? 'inactive' : 'active';
        testimonial.status = newStatus;
        await testimonial.save();

        return newStatus;
    }
}

module.exports = new TestimonialService();
