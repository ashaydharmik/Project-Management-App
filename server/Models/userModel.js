const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email address already exist"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please re-enter your password"],
    },
    newPassword: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("User", userSchema);
