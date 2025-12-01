const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword, email, role });
    await user.save();
    return res.status(200).json({ message: "user registered succesfully" });
  } catch (error) {
    console.log("error in registering user", error);
    return res.status(400).json({ message: "error in registering user" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username: username });
    console.log("user", user);

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      "qwerty",
      { expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({
        message: "login succesfull",
        token,
        role: user.role,
        username: user.username,
      });
  } catch (error) {
    console.log("error in login", error);
    return res.status(400).json({ message: "error in login of user" });
  }
};
