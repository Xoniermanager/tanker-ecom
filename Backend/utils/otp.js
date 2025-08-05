const queueManager = require("../queues/manager");
const { sendEmail } = require("./email");

/**
 * Generate a 6-digit OTP (One-Time Password).
 *
 * @returns {string} - A 6-digit OTP.
 */
function generateOtp() {
    if (process.env.NODE_ENV !== 'production')
        return "123456";

    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString().padStart(6, "0");
}

/**
 * Get OTP subject and message based on the OTP type.
 *
 * @param {string} otp - The generated OTP code.
 * @param {string} type - The purpose of the OTP (e.g., 'email_verification', 'login_otp', 'password_reset').
 * @returns {{ subject: string, text: string }}
 */
function getOtpEmailContent(otp, type = "generic") {
    switch (type) {
        case "email_verification":
            return {
                subject: "Verify Your Email Address",
                text: `Welcome! Your email verification code is: ${otp}`,
            };
        case "login_otp":
            return {
                subject: "Login OTP",
                text: `Your login OTP is: ${otp}. This code is valid for 10 minutes.`,
            };
        case "password_reset":
            return {
                subject: "Reset Your Password",
                text: `Your OTP to reset your password is: ${otp}`,
            };
        default:
            return {
                subject: "Your OTP Code",
                text: `Your OTP is: ${otp}`,
            };
    }
}

/**
 * Send an OTP email based on its purpose/type.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP code to send.
 * @param {string} [type='generic'] - The OTP type/purpose.
 * @returns {Promise<void>}
 */
async function sendOtpEmail(email, otp, type = "generic") {
    try {
        const { subject, text } = getOtpEmailContent(otp, type);

        const mailOptions = {
            to: email,
            subject,
            text,
        };

        await sendEmail(mailOptions);
        // const queue = queueManager.getQueue('general');
        // await queue.addJob('sendEmail', mailOptions);

        console.log(`[OTP:${type}] sent to ${email}`);
    } catch (error) {
        console.error(
            `[OTP:${type}] send failed for ${email}: ${error.message}`
        );
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
}

module.exports = { generateOtp, sendOtpEmail };
