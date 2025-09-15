const { z } = require("zod");

const contactSchema = z.object({
    firstName: z.string({
        required_error: "First name is required.",
        invalid_type_error: "First name must be a string.",
    }).min(1, "First name cannot be empty."),

    lastName: z.string({
        required_error: "Last name is required.",
        invalid_type_error: "Last name must be a string.",
    }).min(1, "Last name cannot be empty."),

    phone: z.string({
        required_error: "Phone number is required.",
        invalid_type_error: "Phone number must be a string.",
    }).min(1, "Phone number cannot be empty."),

    email: z.string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a string.",
    }).email("Invalid email address."),

    message: z.string({
        required_error: "Message is required.",
        invalid_type_error: "Message must be a string.",
    }).min(1, "Message cannot be empty."),
    captchaToken: z.string({required_error: "Captcha token is required.",})
    .min(1, "Captcha token cannot be empty"),
});

module.exports = {
    contactSchema,
};
