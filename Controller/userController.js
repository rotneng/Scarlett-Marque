const User = require("../Models/userModel");
const Token = require("../Models/tokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail, createTransporter } = require("../Util/EmailService"); // Import both here

// --- 1. Register User (Fixed: Non-blocking Email) ---
exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      role,
    });

    // Generate OTP
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const token = new Token({
        email,
        token: otp,
      });
      await token.save();

      // --- FIX: FIRE AND FORGET ---
      // We removed 'await'. The server will NOT wait for this to finish.
      // It sends the success response immediately.
      sendEmail(email, otp).catch(err => console.log("Background Email Failed:", err));
      
      console.log("OTP Email process started in background...");
    } catch (emailError) {
      console.log("Error preparing OTP:", emailError);
    }

    await user.save();
    return res.status(200).json({
      message: "User registered successfully. Please check email for OTP.",
    });
  } catch (error) {
    console.log("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

// --- 2. Login User ---
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    console.log("Error in login:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// --- 3. Verify Email ---
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const tokenDoc = await Token.findOne({ email, token: otp });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();
    await Token.findByIdAndDelete(tokenDoc._id);

    const authToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Email verified and logged in successfully",
      token: authToken,
      user: {
        username: user.username,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error verifying email:", error);
    return res
      .status(500)
      .json({ message: "Server error during verification" });
  }
};

// --- 4. Resend OTP (Fixed: Non-blocking Email) ---
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Token.findOneAndUpdate(
      { email },
      { token: otp },
      { upsert: true, new: true }
    );

    // Removed 'await' here too
    sendEmail(email, otp).catch(err => console.log("Resend Email Failed:", err));

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.log("Error resending OTP:", error);
    return res.status(500).json({ message: "Error resending OTP" });
  }
};

// --- 5. Forgot Password (Fixed: Non-blocking Email) ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const clientUrl =
      process.env.NODE_ENV === "production"
        ? "https://scarlett-marque.onrender.com"
        : "http://localhost:3000";

    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Prepare email logic
    // We wrap this in an async IIFE or just call it without await to prevent blocking
    const sendResetEmail = async () => {
        try {
            const transporter = await createTransporter();
            const mailOptions = {
                from: `"Scarlett Marque" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Password Reset Request",
                html: `
                  <h3>Password Reset Request</h3>
                  <p>You requested a password reset. Please click the link below to verify your identity and set a new password:</p>
                  <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
                  <p>This link expires in 1 hour.</p>
                  <p>If you did not request this, please ignore this email.</p>
                `,
            };
            await transporter.sendMail(mailOptions);
            console.log("Reset email sent");
        } catch (err) {
            console.log("Reset email failed:", err);
        }
    };

    // Execute sending without 'await'
    sendResetEmail();

    return res
      .status(200)
      .json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Error sending reset email" });
  }
};

// --- 6. Reset Password ---
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password reset successfully. Please login." });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};

// --- 7. Save Address ---
exports.saveShippingAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, phone, address, city, state } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.shippingAddress = { fullName, phone, address, city, state };
    await user.save();

    return res.status(200).json({
      message: "Address saved successfully",
      shippingAddress: user.shippingAddress,
    });
  } catch (error) {
    console.log("Error saving address:", error);
    return res.status(500).json({ message: "Error saving address" });
  }
};

// --- 8. Get Address ---
exports.getShippingAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.shippingAddress || {});
  } catch (error) {
    console.log("Error fetching address:", error);
    return res.status(500).json({ message: "Error fetching address" });
  }
};