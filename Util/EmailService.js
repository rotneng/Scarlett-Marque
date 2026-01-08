const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // Brevo Server
    port: 587,                    // Brevo Port (Standard)
    secure: false,                // Must be false for 587
    auth: {
      user: process.env.BREVO_USER, // Your Brevo Login Email
      pass: process.env.BREVO_PASS, // Your Long SMTP Key
    },
    tls: {
      rejectUnauthorized: false,  // Fixes certificate issues on Render
    },
  });
};

const emailLayout = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Welcome To Scarlett Marque</h1>
        <p>Your Verification code is:</p>
        <h2 style="background: #eee; padding: 10px; display: inline-block;">${otp}</h2>
    </div>`;
};

const sendEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    // Log the attempt (hiding the password for security)
    console.log(`[DEBUG] Preparing to send to ${email} via Brevo...`);
    console.log(`[DEBUG] Auth User: ${process.env.BREVO_USER}`);

    // Verify connection before sending
    await transporter.verify();
    console.log("[DEBUG] Connection Verified! Sending now...");

    const info = await transporter.sendMail({
      from: `"Scarlett Marque" <${process.env.BREVO_USER}>`, 
      to: email,
      subject: "Your Verification Code",
      html: emailLayout(otp),
    });

    console.log("SUCCESS: Email sent. ID:", info.messageId);
  } catch (error) {
    console.error("EMAIL FAILED TO SEND. Error Details:");
    console.error(error.message);
    if(error.code === 'EAUTH') console.error("--> HINT: Your SMTP Key is wrong or your account is not active.");
  }
};

module.exports = { createTransporter, sendEmail };