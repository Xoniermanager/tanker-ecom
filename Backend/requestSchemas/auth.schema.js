const { z } = require("zod");
const ENUMS = require("../constants/enums");

const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
        message:
            "Password must include uppercase, lowercase, number, and special character.",
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

module.exports = {
    userRegistrationSchema,
    verifyEmailOtpSchema,
    requestLoginOtpSchema,
    requestVerifyEmailOtpSchema,
    verifyLoginOtpSchema,
    requestPasswordResetSchema,
    resetPasswordSchema
};