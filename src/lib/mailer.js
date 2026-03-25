import nodemailer from 'nodemailer';

// These should be set in .env.local
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'placeholder@gmail.com',
    pass: process.env.EMAIL_PASS || 'placeholder_pass'
  }
});

export default transporter;
