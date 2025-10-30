const { z } = require("zod");
const ENUMS = require("../constants/enums");

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
    message:
      "Password must include uppercase, lowercase, number, and special character.",
  });


const userRegistrationSchema = z
  .object({
    companyEmail: z.string().email({ message: "Invalid company email." }),
    companyName: z.string().min(2, { message: "Company name is required." }),

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

    communicationPreference: z.enum(
      Object.values(ENUMS.COMMUNICATION_PREFERENCE),
      {
        message: "Invalid communication preference.",
      }
    ),
    // captchaToken: z.string({required_error: "Captcha token is required.",})
    // .min(1, "Captcha token cannot be empty"),

    password: passwordSchema,
    confirmPassword: z.string(),
  })
  
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

  const userUpdateSchema = z
  .object({
    companyName: z.string().min(2, { message: "Company name is required" }),
    fullName: z.string().min(2, { message: "Full name is required" }),
    designation: z.string().min(2, { message: "Designation is required" }),
    mobileNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid mobile number" }),
    country: z.string().min(1, { message: "Country is required." }),
    profileImage : z.string().optional(),
    // preferredLanguage: z
    //   .string()
    //   .optional(),
    communicationPreference: z.enum(
      Object.values(ENUMS.COMMUNICATION_PREFERENCE),
      {
        message: "Invalid communication preference.",
      }
    ).optional(),
  })

/**
 ** Login OTP request schema
 */
const requestLoginOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  role: z.string().optional(),
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

const changePasswordSchema = z.object({
  oldPassword: z
    .string({ message: "Old password is required" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    }),
  newPassword: z
    .string({ message: "New Password is required" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    }),
});

module.exports = {
  userRegistrationSchema,
  verifyEmailOtpSchema,
  requestLoginOtpSchema,
  requestVerifyEmailOtpSchema,
  verifyLoginOtpSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  changePasswordSchema, userUpdateSchema
};
