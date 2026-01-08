const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
});

const sendEmail = async (email, otp) => {
  try {
    console.log(`[DEBUG] Sending OTP to: ${email}`);

    await transporter.sendMail({
      from: `"Scarlett Marque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code - Scarlett Marque",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Verification Code</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #0f2a1d; letter-spacing: 2px;">${otp}</h1>
            <p>Please do not share this code with anyone.</p>
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
      from: `"Scarlett Marque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset</h2>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${resetUrl}" style="display:inline-block; background: #0f2a1d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px; font-weight: bold;">Reset Password</a>
            <p style="margin-top: 20px; color: #888; font-size: 12px;">This link expires in 1 hour.</p>
            <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Reset Email sent successfully.");
  } catch (error) {
    console.error("❌ RESET EMAIL FAILED:", error.message);
  }
};

module.exports = { sendEmail, sendResetEmail };
