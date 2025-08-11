const Otp = require("../models/otp.model");
const User = require("../models/user.model");
const BaseRepository = require("./base.repository");

/**
 * Repository class for interacting with the User and OTP collections.
 */
class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    /**
     * Finds a user by email and role.
     *
     * @param {string} email - User's email address.
     * @param {string} role - User's role (e.g., 'admin', 'user').
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object|null>} User document if found, else null.
     */
    async findByEmailAndRole(email, role, session = null) {
        if (!email || !role) {
            throw new Error("Email and role are required to find user.");
        }

        return this.model.findOne({ companyEmail: email, role }).session(session);
    }

    /**
     * Creates a new OTP entry.
     *
     * @param {string} email - Email to associate the OTP with.
     * @param {string} otp - The one-time password.
     * @param {number} expiration - Expiration timestamp in ms.
     * @param {string} type - OTP type (e.g., 'login_otp').
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<void>}
     */
    async createOtp(email, otp, expiration, type, session = null) {
        if (!email || !otp || !expiration || !type) {
            throw new Error("Email, OTP, expiration, and type are required.");
        }

        const otpEntry = new Otp({ email, otp, expiration, type });
        await otpEntry.save({ session });
    }

    /**
     * Finds the most recent OTP entry for a given email and OTP type.
     *
     * @param {string} email - Email address to search for.
     * @param {string} type - OTP type.
     * @param {Object|null} [session=null] - Optional Mongoose session.
     * @returns {Promise<Object|null>} - Latest matching OTP entry or null.
     */
    async findLatestOtpByEmailAndType(email, type, session = null) {
        if (!email || !type) {
            throw new Error("Email and type are required to find OTP.");
        }

        return Otp.findOne({ email, type }).sort({ createdAt: -1 }).session(session);
    }

    
}

module.exports = new UserRepository();
