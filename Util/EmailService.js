const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,        // Back to SSL (often more stable on Render than 587)
    secure: true,     // True for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // CONNECTION STABILITY SETTINGS
    tls: {
      rejectUnauthorized: false, // Fix certificate issues
    },
    family: 4,        // Force IPv4 (Critical for Render)
    
    // DEBUGGING & TIMEOUTS
    logger: true,     // Logs the SMTP conversation to your console
    debug: true,      // Shows detailed connection info
    connectionTimeout: 30000, // Wait 30 seconds (up from 10s default)
    greetingTimeout: 30000,   // Wait 30 seconds for Google to say "Hello"
    socketTimeout: 30000      // Keep connection alive longer
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
    const transporter = createTransporter();

    console.log(`[DEBUG] Attempting to send to ${email} using Port 465 (IPv4)...`);

    const info = await transporter.sendMail({
      from: `"Scarlett Marque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Scarlett Marque",
      text: `Your verification token is ${otp}`,
      html: emailLayout(otp),
    });

    console.log("SUCCESS: Email sent. Message ID:", info.messageId);
  } catch (error) {
    console.error("EMAIL FAILED TO SEND. Error Details:");
    console.error(error); // This will print the full object
  }
};

module.exports = { createTransporter, sendEmail };