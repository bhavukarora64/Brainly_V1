// backend/sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'bhavuk@brainlyy.bhavukarora.eu',
    pass: 'Bhavuk@12345',
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
