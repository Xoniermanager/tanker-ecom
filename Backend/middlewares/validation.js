const { z } = require("zod");
const {
    upsertPageSchema,
    updateSectionSchema,
} = require("../requestSchemas/pageAndSection.schema");
const {
    upsertBlogSchema,
    setPublishStatusSchema,
} = require("../requestSchemas/blog.schema");
const {
    bulkDeleteGallerySchema,
    bulkInsertUpdateGallerySchema
} = require("../requestSchemas/gallery.schema");
const {
    userRegistrationSchema,
    verifyEmailOtpSchema,
    requestLoginOtpSchema,
    requestVerifyEmailOtpSchema,
    verifyLoginOtpSchema,
    requestPasswordResetSchema,
    resetPasswordSchema
} = require("../requestSchemas/auth.schema");
const { contactSchema } = require("../requestSchemas/contact.schema");
const { testimonialSchema } = require("../requestSchemas/testimonial.schema");

const optionalUrl = z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/\S+$/.test(val), {
        message: "Invalid url"
    });

/**
 ** Site Setting Schema
 */
const siteSettingSchema = z.object({
    contactDetails: z.object({
        emails: z.object({
            sales_enquiry: z
                .string()
                .email({ message: "Invalid email for Sales Enquiry." }),
            bdm: z.string().email({ message: "Invalid email for BDM." }),
            footer: z.string().email({ message: "Invalid email for Footer." }),
        }),
        phoneNumbers: z.object({
            service_depot: z
                .string()
                .min(5, { message: "Service Depot phone number is required." }),
            contact_one: z
                .string()
                .min(5, { message: "Contact One phone number is required." }),
            contact_two: z
                .string()
                .min(5, { message: "Contact Two phone number is required." }),
        }),
        addresses: z.object({
            head_office: z
                .string()
                .min(5, { message: "Head Office address is required." }),
            service_depot: z
                .string()
                .min(5, { message: "Service Depot address is required." }),
        }),
        socialMediaLinks: z.object({
            facebook: optionalUrl,
            twitter: optionalUrl,
            instagram: optionalUrl,
            linkedin: optionalUrl,
            youtube: optionalUrl
        }),
    }),
    siteDetails: z.object({
        logo: z.string().url({ message: "Logo must be a valid URL." }).optional(),
        title: z.string().min(1, { message: "Site title is required." }),
        slogan: z.string().optional(),
        description: z.string().optional(),
    }),
    seoDetails: z.object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        keywords: z.array(z.string()).optional(),
    }),
});

/**
 ** Helper function for body schema validation
 */
const validateSchema = async (req, res, next, schema) => {
    try {
        const resolvedSchema =
            typeof schema === "function" ? await schema() : schema;
        const validatedData = resolvedSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(422).json({
            success: false,
            message: "Validation error",
            errors: error.errors,
        });
    }
};

/**
 ** Helper function for query schema validation
 */
const validateQuery = async (req, res, next, schema) => {
    try {
        const resolvedSchema =
            typeof schema === "function" ? await schema() : schema;
        const validatedData = resolvedSchema.parse(req.query);
        req.query = validatedData;
        next();
    } catch (error) {
        res.status(422).json({
            success: false,
            message: "Validation error",
            errors: error.errors,
        });
    }
};

/**
 **  Helper function for multipart json validation
 */
const validateMultipartJsonField = (req, res, next, schema, fieldName = 'items') => {
    try {
        if (typeof req.body[fieldName] === 'string') {
            req.body[fieldName] = JSON.parse(req.body[fieldName]);
        }

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(422).json({
                success: false,
                message: "Validation error",
                errors: result.error.errors,
            });
        }

        req.body = result.data;
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Invalid JSON in '${fieldName}'`,
            error: err.message,
        });
    }
};

// Middleware exports
const validateUserRegistration = (req, res, next) =>
    validateSchema(req, res, next, userRegistrationSchema);
const validateVerifyEmailOtp = (req, res, next) =>
    validateSchema(req, res, next, verifyEmailOtpSchema);
const validateRequestLoginOtp = (req, res, next) =>
    validateSchema(req, res, next, requestLoginOtpSchema);
const validateRequestVerifyEmailOtp = (req, res, next) =>
    validateSchema(req, res, next, requestVerifyEmailOtpSchema);
const validateVerifyLogin = (req, res, next) =>
    validateSchema(req, res, next, verifyLoginOtpSchema);
const validateRequestPasswordReset = (req, res, next) =>
    validateSchema(req, res, next, requestPasswordResetSchema);
const validateResetPassword = (req, res, next) =>
    validateSchema(req, res, next, resetPasswordSchema);
const validateSiteSetting = (req, res, next) =>
    validateSchema(req, res, next, siteSettingSchema);
const validateUpsertPageWithSections = (req, res, next) =>
    validateSchema(req, res, next, upsertPageSchema);
const validateUpdateSection = (req, res, next) =>
    validateSchema(req, res, next, updateSectionSchema);
const validateUpsertBlog = (req, res, next) =>
    validateSchema(req, res, next, upsertBlogSchema);
const validatePublishStatus = (req, res, next) =>
    validateSchema(req, res, next, setPublishStatusSchema);
const validateBulkInsertUpdateGalleryItems = (req, res, next) =>
    validateMultipartJsonField(req, res, next, bulkInsertUpdateGallerySchema, 'items');
const validateBulkDeleteGalleryItems = (req, res, next) =>
    validateSchema(req, res, next, bulkDeleteGallerySchema);
const validateContact = (req, res, next) =>
    validateSchema(req, res, next, contactSchema);
const validateTestimonial = (req, res, next) =>
    validateSchema(req, res, next, testimonialSchema);

module.exports = {
    validateUserRegistration,
    validateVerifyEmailOtp,
    validateRequestLoginOtp,
    validateVerifyLogin,
    validateRequestPasswordReset,
    validateResetPassword,
    validateRequestVerifyEmailOtp,
    validateSiteSetting,
    validateUpsertPageWithSections,
    validateUpdateSection,
    validateUpsertBlog,
    validatePublishStatus,
    validateBulkInsertUpdateGalleryItems,
    validateBulkDeleteGalleryItems,
    validateContact,
    validateTestimonial
};
