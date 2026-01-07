const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = async () => {
  // Safety Check
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing Email Credentials in Environment Variables");
  }

  return nodemailer.createTransport({
    service: "gmail", // Use the built-in 'gmail' service shortcut
    host: "smtp.gmail.com",
    port: 587,        // Changed from 465 to 587 (Better for Cloud Servers)
    secure: false,    // Must be false for Port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Fixes SSL errors
    },
    // TIMEOUT SETTINGS (Fix for 'Connection timeout')
    connectionTimeout: 10000, // Wait max 10 seconds to connect
    greetingTimeout: 5000,    // Wait max 5 seconds for greeting
    socketTimeout: 10000,     // Close socket if idle for 10 seconds
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
    
    console.log(`Attempting to send OTP to: ${email} via Port 587...`);
    
    // Verify connection configuration
    await transporter.verify();
    console.log("Transporter Verified. Sending now...");

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
    if(error.code === 'ETIMEDOUT') {
        console.error("TIP: Google might be blocking the connection. Check 'less secure apps' or App Password.");
    }
  }
};

module.exports = { createTransporter, sendEmail };