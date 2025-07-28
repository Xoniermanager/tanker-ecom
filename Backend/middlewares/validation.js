const { z } = require("zod");
const ENUMS = require("../constants/enums");
const {
    upsertPageSchema,
    updateSectionSchema,
} = require("../requestSchemas/pageAndSection.schema");
const {
    upsertBlogSchema,
    setPublishStatusSchema,
} = require("../requestSchemas/blog.schema");
const {
    bulkInsertGallerySchema,
    bulkUpdateGallerySchema,
    bulkDeleteGallerySchema
} = require("../requestSchemas/gallery.schema");

// Reusable password schema
const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
        message:
            "Password must include uppercase, lowercase, number, and special character.",
    });

const optionalUrl = z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/\S+$/.test(val), {
        message: "Invalid url"
    });

/**
 ** Registration Schema
 */
const userRegistrationSchema = z
    .object({
        companyEmail: z.string().email({ message: "Invalid company email." }),
        companyName: z
            .string()
            .min(2, { message: "Company name is required." }),

        fullName: z.string().min(2, { message: "Full name is required." }),
        designation: z.string().min(2, { message: "Designation is required." }),
        mobileNumber: z
            .string()
            .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid mobile number." }),
        alternativeEmail: z
            .string()
            .email({ message: "Invalid alternative email." })
            .optional(),

        country: z.string().min(1, { message: "Country is required." }),
        preferredLanguage: z
            .string()
            .min(1, { message: "Preferred language is required." }),
        communicationPreference: z.enum(
            Object.values(ENUMS.COMMUNICATION_PREFERENCE),
            {
                message: "Invalid communication preference.",
            }
        ),

        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords must match.",
    });

/**
 ** Login OTP request schema
 */
const requestLoginOtpSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: passwordSchema,
});

/**
 ** Verify Email OTP request schema
 */
const requestVerifyEmailOtpSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
});

/**
 ** Login OTP verification schema
 */
const verifyLoginOtpSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: passwordSchema,
    otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
});

/**
 ** Email verification OTP schema (after registration)
 */
const verifyEmailOtpSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
});

/**
 ** Request password reset schema
 */
const requestPasswordResetSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
});

/**
 ** Reset password schema
 */
const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
    newPassword: passwordSchema,
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
 ** Helper for body schema
 */
const validateSchema = async (req, res, next, schema) => {
    try {
        const resolvedSchema =
            typeof schema === "function" ? await schema() : schema;
        const validatedData = resolvedSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        console.log("error.errors", error);

        res.status(422).json({
            success: false,
            message: "Validation error",
            errors: error.errors,
        });
    }
};

/**
 ** Helper for query schema
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
const validateBulkInsertGalleryItems = (req, res, next) =>
    validateSchema(req, res, next, bulkInsertGallerySchema);
const validateBulkUpdateGalleryItems = (req, res, next) =>
    validateSchema(req, res, next, bulkUpdateGallerySchema);
const validateBulkDeleteGalleryItems = (req, res, next) =>
    validateSchema(req, res, next, bulkDeleteGallerySchema);

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
    validateBulkInsertGalleryItems,
    validateBulkUpdateGalleryItems,
    validateBulkDeleteGalleryItems
};
