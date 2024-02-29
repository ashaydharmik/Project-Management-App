const asyncHandler = require("../Middleware/asyncHandler");
const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
    return;
  }

  const availableUser = await User.findOne({ email });
  if (availableUser) {
    res.status(400).json({ message: "Email address already exists!!" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    confirmPassword: await bcrypt.hash(confirmPassword, 10),
    registrationDate: new Date(),
  });

  if (user) {
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.ACCESS_KEY
    );
    res.status(201).json({
      message: "User successfully created",
      _id: user.id,
      userName: user.name,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

//user login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
      },
      process.env.ACCESS_KEY
    );
    res.status(201).json({
      message: "User Successfully logIn",
      id: user.id,
      userName: user.name,
      registrationDate: user.registrationDate,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email and password");
  }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
  const { name, password, newPassword } = req.body;

  if (!name || !password || !newPassword) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  const user = await User.findOne({ name });
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(400).json({ message: "Invalid current password" });
    return;
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  user.password = hashedNewPassword;
  await user.save();

  const token = jwt.sign({ email: user.email }, process.env.ACCESS_KEY);

  res.status(200).json({
    message: "Password successfully updated",
    _id: user.id,
    userName: user.name,
    lastLoginDate: new Date(),
    token,
  });
});

//fetching current user
const currentUser = asyncHandler(async (req, res) => {
  try {
    console.log("Decoded Token:", req.user);
    const { name } = req.user;

    const user = await User.findOne({ name });

    if (!user) {
      console.error("User not found in the database.");
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      userName: user.name,
      registrationDate: user.registrationDate,
      lastLoginDate: new Date(),
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { registerUser, loginUser, updatePassword, currentUser };
