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
    validateChangePassword,
    validateUpdateUser
} = require("../middlewares/validation");
const authorize = require("../middlewares/auth");
const upload = require("../config/multer");

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
router.post("/refresh-token", authController.refreshToken);
router.post('/logout', authorize(['admin', 'user']), authController.logout);
router.patch('/change-password', authorize(['admin', 'user']), validateChangePassword, authController.changePassword);
router.get('/me', authorize(['admin', 'user']), authController.getMe);
router.get('/user/:id', authorize(['admin']), authController.getUserByID);
router.get('/all-users', authorize(['admin']), authController.getall);
router.post('/activate/:id', authorize(['admin']), authController.activate);
router.post('/deactivate/:id', authorize(['admin']), authController.deactivate);
router.put('/profile-update', authorize(['admin', 'user']), upload.single("file"), validateUpdateUser, authController.updateProfile);
router.route("/remove-profile-img").patch(authorize(['admin', 'user']), authController.removeProfileImage)


module.exports = router;
