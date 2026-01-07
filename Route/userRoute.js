const express = require("express");
const {
  registerUser,
  loginUser,
  saveShippingAddress,
  getShippingAddress,
  verifyEmail,
  resendOtp,
  forgotPassword, 
  resetPassword, 
} = require("../Controller/userController");

const { requireSignin } = require("../Middlewares/auth");
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);
router.post("/loginUser", loginUser);

router.post("/forgot-password", forgotPassword); 
router.post("/reset-password", resetPassword); 

router.post("/shipping", requireSignin, saveShippingAddress);
router.get("/shipping", requireSignin, getShippingAddress);

router.get("/profile", requireSignin, (req, res) => {
  res.status(200).json({ message: "user profile", user: req.user });
});

router.get("/admin", requireSignin, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.status(200).json({ message: "admin content", user: req.user });
});

module.exports = router;