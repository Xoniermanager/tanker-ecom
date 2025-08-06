const Testimonial = require("../../models/cms/testimonial.model");
const BaseRepository = require("../base.repository");

/**
 * Repository for managing testimonials.
 */
class TestimonialRepository extends BaseRepository {
    constructor() {
        super(Testimonial);
    }
}

module.exports = new TestimonialRepository();
