const userRepository = require("../repositories/user.repository");
const customError = require("../utils/error");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../utils/jwt");
const { generateOtp, sendOtpEmail } = require("../utils/otp");
const { OTP_EXPIRY_DURATION } = require("../constants/enums");
const { default: mongoose } = require("mongoose");

/**
 * UserService handles registration, login, email verification, password reset, and token refresh.
 */
class UserService {
    /**
     * Registers a new user and sends an email verification OTP.
     * @param {Object} userData - User data to register.
     * @returns {Promise<Object>} - The created user.
     * @throws {Error} - If email is already registered.
     */
    async register(userData) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const existingUser = await userRepository.findOne(
                { companyEmail: userData.companyEmail },
                null,
                session
            );
            if (existingUser) {
                throw customError("Email is already registered", 400);
            }

            const user = await userRepository.create(userData, session);

            const otp = generateOtp();
            await sendOtpEmail(user.companyEmail, otp, "email_verification");
            await userRepository.createOtp(
                user.companyEmail,
                otp,
                Date.now() + OTP_EXPIRY_DURATION.email_verification,
                "email_verification",
                session
            );

            await session.commitTransaction();
            return user;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Verifies the OTP sent during registration to verify email.
     * @param {string} email - Email address of the user.
     * @param {string} otp - OTP to verify.
     * @returns {Promise<Object>} - Verification result.
     */
    async verifyEmailOtp(email, otp) {
        const isOtpValid = await this.validateOtp(
            email,
            otp,
            "email_verification"
        );

        if (!isOtpValid) throw customError("Invalid or expired OTP", 400);

        const user = await userRepository.findOne({ companyEmail: email });
        if (!user) throw customError("User not found", 400);

        if (!user.emailVerifiedAt) {
            user.emailVerifiedAt = new Date();
            await user.save();
        }

        return { message: "Email verified successfully" };
    }

    /**
     * Sends OTP to user's email after validating credentials (for login).
     * @param {Object} param0 - { email, password, role }
     * @returns {Promise<boolean>}
     */
    async requestLoginOtp({ email, password, role }) {
        await this.validateUserAndPassword(email, password, role);

        const otp = generateOtp();
        // TODO: implement queue (async) to send email
        await sendOtpEmail(email, otp, "login_otp");
        await userRepository.createOtp(
            email,
            otp,
            Date.now() + OTP_EXPIRY_DURATION.login_otp,
            "login_otp"
        );

        return true;
    }

    /**
     * Verifies OTP and logs in the user.
     * @param {Object} param0 - { email, otp, password, role }
     * @returns {Promise<Object>} - Access & refresh tokens + user
     */
    async verifyLoginOtp({ email, otp, password, role }) {
        const isOtpValid = await this.validateOtp(email, otp, "login_otp");
        if (!isOtpValid) throw customError("Invalid or expired OTP", 400);

        const user = await this.validateUserAndPassword(email, password, role);

        const accessToken = generateAccessToken(user._id, role);
        const refreshToken = generateRefreshToken(user._id);

        return {
            returnData: { user },
            refreshToken,
            accessToken,
        };
    }

    /**
     * Requests OTP for password reset.
     * @param {Object} param0 - { email }
     * @returns {Promise<boolean>}
     */
    async requestPasswordReset({ email }) {
        const user = await userRepository.findOne({ companyEmail: email });
        if (!user) throw customError("User not found", 400);

        // Block unverified users
        if (!user.emailVerifiedAt) {
            throw customError(
                "Please verify your email before resetting password",
                403
            );
        }

        const otp = generateOtp();
        // TODO: implement queue (async) to send email
        await sendOtpEmail(email, otp, "password_reset");
        await userRepository.createOtp(
            email,
            otp,
            Date.now() + OTP_EXPIRY_DURATION.password_reset,
            "password_reset"
        );

        return true;
    }

    /**
     * Verifies OTP and resets the password.
     * @param {Object} param0 - { email, otp, newPassword }
     * @returns {Promise<Object>} - Success message
     */
    async resetPassword({ email, otp, newPassword }) {
        const isOtpValid = await this.validateOtp(email, otp, "password_reset");
        if (!isOtpValid) throw customError("Invalid or expired OTP", 400);

        const user = await userRepository.findOne({ companyEmail: email });
        if (!user) throw customError("User not found", 400);

        // Block unverified users
        if (!user.emailVerifiedAt) {
            throw customError("Please verify your email to refresh token", 403);
        }

        user.password = newPassword;
        await user.save();

        return { message: "Password has been reset successfully." };
    }

    /**
     * Resends the email verification OTP if none is active.
     *
     * @param {string} email - Email to resend OTP for.
     * @returns {Promise<Object>} - Success message
     * @throws {Error} - If user not found or already verified or OTP recently sent.
     */
    async resendEmailVerificationOtp(email) {
        const user = await userRepository.findOne({ companyEmail: email });
        if (!user) throw customError("User not found", 400);

        if (user.emailVerifiedAt) {
            throw customError("Email is already verified", 400);
        }

        await this.resendOtpHelper(email, "email_verification");
        return { message: "Email verification OTP resent successfully" };
    }

    /**
     * Resends the login OTP if none is active.
     *
     * @param {Object} param0 - Object with email, password, and role
     * @param {string} param0.email
     * @param {string} param0.password
     * @param {string} param0.role
     * @returns {Promise<Object>} - Success message
     * @throws {Error} - If credentials are invalid or OTP recently sent.
     */
    async resendLoginOtp({ email, password, role }) {
        await this.validateUserAndPassword(email, password, role);
        await this.resendOtpHelper(email, "login_otp");
        return { message: "Login OTP resent successfully" };
    }

    /**
     * Refreshes the access token using the refresh token.
     * @param {Object} req - Express request with cookie.
     * @returns {Promise<Object>} - New access token
     */
    async refreshToken(req) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw customError("No refresh token provided", 400);

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) throw customError("Invalid refresh token", 400);

        const user = await userRepository.findById(decoded.id);
        if (!user) throw customError("User not found", 400);

        const accessToken = generateAccessToken(user._id, user.role || "user");

        return { accessToken };
    }

    // ========== Helper Methods ==========

    /**
     * Validates email and password for a user.
     * @param {string} email
     * @param {string} password
     * @param {string} role
     * @returns {Promise<Object>} - User object if valid.
     */
    async validateUserAndPassword(email, password, role) {
        const user = await userRepository.findByEmailAndRole(email, role);
        if (!user) throw customError("User not found", 400);

        // Block unverified users
        if (!user.emailVerifiedAt) {
            throw customError(
                "Please verify your email before continuing",
                403
            );
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) throw customError("Invalid password", 400);

        return user;
    }

    /**
     * Validates an OTP for a specific purpose.
     * @param {string} email
     * @param {string} otp
     * @param {string} type - OTP type: 'login_otp' | 'email_verification' | 'password_reset'
     * @returns {Promise<boolean>}
     */
    async validateOtp(email, otp, type) {
        const otpData = await userRepository.findLatestOtpByEmailAndType(
            email,
            type
        );

        if (
            !otpData ||
            otpData.otp != otp ||
            Date.now() > otpData.expiration
        ) {
            return false;
        }

        return true;
    }

    /**
     * Sends a new OTP if no active OTP exists for the user and purpose.
     *
     * @private
     * @param {string} email - The user's email address.
     * @param {string} type - OTP type: 'email_verification' | 'login_otp'
     * @param {string} [templateType] - Optional template type for the email content.
     * @returns {Promise<void>}
     * @throws {Error} - If an active OTP exists that hasn't expired.
     */
    async resendOtpHelper(email, type, templateType = type) {
        const existingOtp = await userRepository.findLatestOtpByEmailAndType(
            email,
            type
        );
        if (existingOtp && existingOtp.expiration > Date.now()) {
            throw customError(
                "An OTP was already sent recently. Please wait before requesting again.",
                429
            );
        }

        const otp = generateOtp();
        await sendOtpEmail(email, otp, templateType);
        await userRepository.createOtp(
            email,
            otp,
            Date.now() + OTP_EXPIRY_DURATION[type],
            type
        );
    }
}

module.exports = { UserService };
