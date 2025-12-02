const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { nonEmptyString, nonEmptyNumber } = require("../validator")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: nonEmptyString, message: "Username Cannot be Empty!!!"
    }
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: nonEmptyString, message: "Password Cannot be Empty!!!"
    }
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: nonEmptyString, message: "Password Cannot be Empty!!!"
    }
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
