const { z } = require("zod");

const testimonialSchema = z.object({
    name: z.string({
        required_error: "Name is required.",
        invalid_type_error: "Name must be a string.",
    }).min(1, { message: "Name cannot be empty." }),

    designation: z.string({
        invalid_type_error: "Designation must be a string.",
    }).min(1, { message: "Designation cannot be empty." }),

    message: z.string({
        required_error: "Message is required.",
        invalid_type_error: "Message must be a string.",
    }).min(1, { message: "Message cannot be empty." }),

    status: z.enum(["active", "inactive"]).optional(),
});

module.exports = {
    testimonialSchema,
};
