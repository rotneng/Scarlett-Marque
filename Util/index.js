const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

exports.upload = multer({ storage });

exports.requireSignIn = (req, res, next) => {
  if (req.header.authorization) {
    const token = req.header.authorization.split(" ")[1];
    const user = jwt.verify(token, "qwerty");
    req.user = user;
  } else {
    return res.status(500).json({ message: "authorization required" });
  }
  next();
};
