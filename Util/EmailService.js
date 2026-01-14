const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const sendEmail = async (email, otp) => {
  try {
    console.log(`[DEBUG] Sending OTP to: ${email}`);

    await transporter.sendMail({
      from: `"Scarlett Marque" <${process.env.BREVO_USER}>`,
      to: email,
      subject: "Verification Code - Scarlett Marque",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Verification Code</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #0f2a1d; letter-spacing: 2px;">${otp}</h1>
        </div>
      `,
    });
    console.log("✅ OTP Email sent successfully.");
  } catch (error) {
    console.error("❌ OTP EMAIL FAILED:", error.message);
  }
};

const sendResetEmail = async (email, resetUrl) => {
  try {
    console.log(`[DEBUG] Sending Reset Link to: ${email}`);

    await transporter.sendMail({
      from: `"Scarlett Marque" <${process.env.BREVO_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset</h2>
            <p>Click the link below to set a new password:</p>
            <a href="${resetUrl}" style="background: #0f2a1d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>Link expires in 1 hour.</p>
        </div>
      `,
    });
    console.log("✅ Reset Email sent successfully.");
  } catch (error) {
    console.error("❌ RESET EMAIL FAILED:", error.message);
  }
};

module.exports = { sendEmail, sendResetEmail };
