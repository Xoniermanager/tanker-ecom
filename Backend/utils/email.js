const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email with provided details.
 * 
 * @param {Object} emailDetails - The email details.
 * @param {string} emailDetails.to - The recipient email address.
 * @param {string} emailDetails.subject - The subject of the email.
 * @param {string} emailDetails.text - The plain text content of the email.
 * @param {string} emailDetails.html - The HTML content of the email.
 * @returns {Promise<void>} - Resolves when the email is sent successfully, rejects if failed.
 * @throws {Error} - Throws an error if sending the email fails.
 */
async function sendEmail({ to, subject, text, html }) {
    if (!to || !subject || (!text && !html)) {
        throw new Error('Failed to send email: Missing required email fields: to, subject, and either text or html');
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        throw new Error(`Failed to send email to ${to}: ${error.message}`);
    }
}

module.exports = { sendEmail };
