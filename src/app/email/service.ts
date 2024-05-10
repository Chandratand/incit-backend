import nodemailer from 'nodemailer';
import { createEmailVerifToken } from '../../utils/jwt';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL,
    pass: process.env.SENDMAIL_PASSWORD,
  },
});

const sendEmailVerification = async (email: string) => {
  try {
    email = 'chieveid@gmail.com';
    const token = createEmailVerifToken(email);
    let message = {
      from: process.env.GMAIL,
      to: email,
      subject: '[INCIT]: Email Verification ',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h1 style="color: #444;">Verify Your Email</h1>
            <p>Please verify your email by clicking on the link below. <strong>This link is only valid for 5 minutes.</strong></p>
            <a href="${process.env.FE_URL}/verify-email?token=${token}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify Email</a>
        </div>
    `, // html body
    };

    return await transporter.sendMail(message);
    return true;
  } catch (ex) {
    console.log(ex);
  }
};

const EmailSercive = { sendEmailVerification };
export default EmailSercive;
