const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = async () => {
  // 1. Safety Check: Ensure variables exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("CRITICAL ERROR: EMAIL_USER or EMAIL_PASS is missing in .env or Render Environment Variables!");
    throw new Error("Missing Email Credentials");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // 2. Fix for Cloud Server SSL Issues
    tls: {
      rejectUnauthorized: false
    }
  });
};

const emailLayout = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Scarlett Marque Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
        <h1 style="color: #0f2a1d;">Welcome To Scarlett Marque Store</h1>
        <p>Signup Successful!</p>
        <p>Your Verification code is: <strong style="font-size: 18px;">${otp}</strong></p>
    </body>
    </html>`;
};

const sendEmail = async (email, otp) => {
  try {
    const transporter = await createTransporter();

    console.log(`Attempting to send OTP to: ${email}`);

    const info = await transporter.sendMail({
      from: `"Scarlett Marque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Scarlett Marque",
      text: `Your verification token is ${otp}`,
      html: emailLayout(otp),
    });

    console.log("SUCCESS: Email sent. Message ID:", info.messageId);
  } catch (error) {
    console.error("EMAIL FAILED TO SEND:", error.message);
    // We log the error but don't crash the server
  }
};

module.exports = { createTransporter, sendEmail };