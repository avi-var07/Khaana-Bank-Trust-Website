import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'placeholder@gmail.com',
    pass: process.env.EMAIL_PASS || 'placeholder_pass'
  }
});

// Gmail requires the from address to match the authenticated account.
// Using the actual Gmail address ensures delivery.
export const senderAddress = `"Khaana Bank Trust" <${process.env.EMAIL_USER || 'khaanabanktrust@gmail.com'}>`;

export default transporter;
