const express = require("express");
const { AuthController } = require("../controllers/auth.controller");
const {
    validateUserRegistration,
    validateRequestLoginOtp,
    validateVerifyLogin,
    validateRequestPasswordReset,
    validateResetPassword,
    validateRequestVerifyEmailOtp,
    validateVerifyEmailOtp,
} = require("../middlewares/validation");

const router = express.Router();
const authController = new AuthController();

// ==================== Auth Routes ====================
router.post("/register", validateUserRegistration, authController.register);
router.post(
    "/verify-email",
    validateVerifyEmailOtp,
    authController.verifyEmailOtp
);
router.post(
    "/request-login-otp",
    validateRequestLoginOtp,
    authController.requestLoginOtp
);
router.post("/login", validateVerifyLogin, authController.verifyLoginOtp);
router.post(
    "/request-admin-login-otp",
    validateRequestLoginOtp,
    authController.requestAdminLoginOtp
);
router.post(
    "/admin-login",
    validateVerifyLogin,
    authController.verifyAdminLoginOtp
);
router.post(
    "/request-password-reset",
    validateRequestPasswordReset,
    authController.requestPasswordReset
);
router.post(
    "/reset-password",
    validateResetPassword,
    authController.resetPassword
);
router.post(
    "/resend-email-otp",
    validateRequestVerifyEmailOtp,
    authController.resendEmailVerificationOtp
);
router.post(
    "/resend-login-otp",
    validateRequestLoginOtp,
    authController.resendLoginOtp
);
router.post(
    "/refresh-token",
    // validateRequestLoginOtp,
    authController.refreshToken
);

module.exports = router;
