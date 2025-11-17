const queueManager = require("../queues/manager");
const { sendEmail } = require("./email");


function generateOtp() {
    if (process.env.NODE_ENV !== 'production')
        return "123456";

    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString().padStart(6, "0");
}


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

       
    } catch (error) {
        console.error(
            `[OTP:${type}] send failed for ${email}: ${error.message}`
        );
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
}

module.exports = { generateOtp, sendOtpEmail };
