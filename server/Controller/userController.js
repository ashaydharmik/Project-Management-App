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
  });

  if (user) {
    const token = jwt.sign({ email: user.email }, process.env.ACCESS_KEY, {expiresIn:"5min"});
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
        user: {
          id: user.id,
          email: user.email,
          password: user.password,
        },
      },
      process.env.ACCESS_KEY,
      {expiresIn:"5min"}
    );
    res.status(201).json({
      message: "User Successfully logIn",
      id: user.id,
      userName: user.name,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email and password");
  }
});

module.exports = { registerUser, loginUser };
