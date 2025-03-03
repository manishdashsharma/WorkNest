import nodemailer from 'nodemailer';
import config from './config.js'; // Ensure config is correctly imported

const transporter = nodemailer.createTransport({
  host: config.SMTP_MAIL_HOST,
  port: Number(config.SMTP_MAIL_PORT),
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `Easy Tech Innovate <${config.EMAIL_USER}>`,
      to,
      subject,
      text,
      ...(html && { html }),
    });
  } catch (err) {
    throw new Error(`Failed to send email: ${err.message || 'Unknown error'}`);
  }
};
