const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 30000

});


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
        const info = await mailTransporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        throw new Error(`Failed to send email to ${to}: ${error.message}`);
    }
}

module.exports = { sendEmail, mailTransporter };
