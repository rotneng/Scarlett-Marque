const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = async () => {
    return nodemailer.createTransport({
        service: "gmail",
        // port: 587,
        // secure: false,
        auth: {
            // user: "rotneng@gmail.com",
            // pass: "xmqyewamsirsaeyo"
             user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })
}

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
    const info = await transporter.sendMail({
      from: "rotneng@gmail.com",
      to: email,
      subject: "Welcome to Scarlett Marque",
      text: `Your verification token is ${otp}`,
      html: emailLayout(otp),
    });

    console.log("SUCCESS: Email sent. Message ID:", info.messageId);
  } catch (error) {
    console.error("EMAIL FAILED TO SEND:", error.message);
};
}

module.exports = { createTransporter, sendEmail };

