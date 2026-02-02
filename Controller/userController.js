const User = require("../Models/userModel");
const Token = require("../Models/tokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail, sendResetEmail } = require("../Util/EmailService");

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

    // Uncomment this block if you want to enable OTP sending upon registration
    // try {
    //   const otp = Math.floor(100000 + Math.random() * 900000);
    //   const token = new Token({ email, token: otp });
    //   await token.save();

    //   sendEmail(email, otp).catch((err) =>
    //     console.log("Background Email Failed:", err)
    //   );

    //   console.log("OTP Email process started...", otp);
    // } catch (emailError) {
    //   console.log("Error preparing OTP:", emailError);
    // }

    await user.save();
    return res.status(200).json({
      message: "User registered successfully. Please check email for OTP.",
    });
  } catch (error) {
    console.log("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

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

    // UPDATED: Now returning email and _id in the response
    return res.status(200).json({
      message: "Login successful",
      token,
      _id: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

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
        _id: user._id,
      },
    });
  } catch (error) {
    console.log("Error verifying email:", error);
    return res
      .status(500)
      .json({ message: "Server error during verification" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Token.findOneAndUpdate(
      { email },
      { token: otp },
      { upsert: true, new: true }
    );

    sendEmail(email, otp).catch((err) =>
      console.log("Resend Email Failed:", err)
    );

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.log("Error resending OTP:", error);
    return res.status(500).json({ message: "Error resending OTP" });
  }
};

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    let clientURL = "https://scarlettmarque.vercel.app";
    const origin = req.headers.origin;
    if (origin && origin.includes("localhost")) {
      clientURL = origin;
    }
    const resetUrl = `${clientURL}/reset-password/${resetToken}`;

    console.log(`[DEBUG] Sending Reset Link to: ${clientURL}`);
    sendResetEmail(user.email, resetUrl).catch((err) =>
      console.log("Reset Email Failed:", err)
    );

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("------------------------------------------------");
    console.log("🔄 RESET PASSWORD ATTEMPT");
    console.log("Token received:", token);
    console.log("Password received:", password ? "***" : "MISSING");

    const userWithToken = await User.findOne({ resetPasswordToken: token });

    if (!userWithToken) {
      console.log("❌ ERROR: No user found with this specific token.");
      console.log(
        "   (The token might be wrong, or it was overwritten by a new request)"
      );
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (userWithToken.resetPasswordExpires < Date.now()) {
      console.log("❌ ERROR: Token found, but it has EXPIRED.");
      console.log("   Expires:", userWithToken.resetPasswordExpires);
      console.log("   Now:", new Date());
      return res.status(400).json({ message: "Token has expired" });
    }

    console.log("✅ User found:", userWithToken.email);
    const salt = await bcrypt.genSalt(10);
    userWithToken.password = await bcrypt.hash(password, salt);
    userWithToken.resetPasswordToken = undefined;
    userWithToken.resetPasswordExpires = undefined;
    await userWithToken.save();
    console.log("✅ Password successfully updated in DB");
    console.log("------------------------------------------------");

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ SERVER ERROR in resetPassword:", error);
    res.status(500).json({ message: error.message });
  }
};