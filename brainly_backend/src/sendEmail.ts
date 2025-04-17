// backend/sendEmail.js
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async (to:string, subject:string, text:string) => {
  const info = await transporter.sendMail({
    from: '"Bhavuk Arora" <bhavuk@brainlyy.bhavukarora.eu>',
    to,
    subject,
    text,
  });

  return info;
};

export default sendEmail;
