const express = require("express");
const { registerUser, loginUser } = require("../Controller/userController");
const { requireSignin } = require("../Middlewares/auth");
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

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
