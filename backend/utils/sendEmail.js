const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter (Use Ethereal for Dev or Gmail)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL || 'demo@ethereal.email',
            pass: process.env.SMTP_PASSWORD || 'secret'
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'GearGuard'} <${process.env.FROM_EMAIL || 'no-reply@gearguard.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<b>${options.message}</b>` // Simple HTML wrap
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
