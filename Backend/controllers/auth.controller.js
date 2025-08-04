const { UserService } = require("../services/user.service");
const customResponse = require("../utils/response");

class AuthController {
    constructor() {
        this.userService = new UserService();
    }

    /**
     * Registers a new user and sends OTP for email verification.
     */
    register = async (req, res, next) => {
        try {
            const payload = req.body;
            payload.role = "user";
            const response = await this.userService.register(payload);
            customResponse(
                res,
                "Registration successful. Please verify your email.",
                response
            );
        } catch (error) {
            next(error);
        }
    };

    /**
     * Verifies the email using the OTP sent after registration.
     */
    verifyEmailOtp = async (req, res, next) => {
        try {


            const { email, otp } = req.body;
            const response = await this.userService.verifyEmailOtp(email, otp);
            customResponse(res, response.message);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Sends login OTP to regular user after validating credentials.
     */
    requestLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "user",
            };
            await this.userService.requestLoginOtp(payload);
            customResponse(res, "OTP sent for login.");
        } catch (error) {
            next(error);
        }
    };

    /**
     * Sends login OTP to admin after validating credentials.
     */
    requestAdminLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "admin",
            };
            await this.userService.requestLoginOtp(payload);
            customResponse(res, "OTP sent for admin login.");
        } catch (error) {
            next(error);
        }
    };

    /**
     * Verifies login OTP for user, sets refresh token cookie, returns access token + user.
     */
    verifyLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "user",
            };
            const response = await this.userService.verifyLoginOtp(payload);

            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                // sameSite: "strict",
                sameSite: "None",
                maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            });

            res.cookie("accessToken", response.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                // sameSite: "Lax",
                sameSite: "None",
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            });

            customResponse(res, "Login successful", response.returnData);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Verifies login OTP for admin, sets refresh token cookie.
     */
    verifyAdminLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "admin",
            };
            const response = await this.userService.verifyLoginOtp(payload);

            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            });

            res.cookie("accessToken", response.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            });

            customResponse(res, "Admin login successful", response.returnData);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Sends OTP for password reset to registered email.
     */
    requestPasswordReset = async (req, res, next) => {
        try {
            const payload = req.body;
            await this.userService.requestPasswordReset(payload);
            customResponse(res, "Password reset OTP sent successfully.");
        } catch (error) {
            next(error);
        }
    };

    /**
     * Resets password after verifying OTP.
     */
    resetPassword = async (req, res, next) => {
        try {
            const payload = req.body;
            await this.userService.resetPassword(payload);
            customResponse(res, "Password reset successfully.");
        } catch (error) {
            next(error);
        }
    };

    /**
     * Resends the OTP for email verification if no valid OTP is active.
     */
    resendEmailVerificationOtp = async (req, res, next) => {
        try {
            const { email } = req.body;
            await this.userService.resendEmailVerificationOtp(email);
            customResponse(res, "Email verification OTP resent successfully.");
        } catch (error) {
            next(error);
        }
    };

    /**
     * Resends the OTP for login after checking credentials and no valid OTP exists.
     */
    resendLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: req.body.role || "user",
            };
            await this.userService.resendLoginOtp(payload);
            customResponse(res, "Login OTP resent successfully.");
        } catch (error) {
            next(error);
        }
    };

    /**
     * Refreshes access token using valid refresh token.
     */
    refreshToken = async (req, res, next) => {
        try {
            const response = await this.userService.refreshToken(req);

            res.cookie("accessToken", response.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            });

            customResponse(res, "Access token refreshed successfully.");
        } catch (error) {
            next(error);
        }
    };

    getMe = async (req, res, next) => {
        try {
            const user = await this.userService.getMe(req);
            customResponse(res, user);
        } catch (error) {
            next(error);
        }
    }
}

exports.AuthController = AuthController;
