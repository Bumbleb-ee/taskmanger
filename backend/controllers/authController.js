const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/*
========================
REGISTER USER
POST /api/auth/register
========================
*/
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // 1️⃣ Validate input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // 2️⃣ Check existing user
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 3️⃣ Create user (password auto-hashed by model)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 4️⃣ Send response + token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

/*
========================
LOGIN USER
POST /api/auth/login
========================
*/
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Find user
  const user = await User.findOne({ email });

  // 2️⃣ Check password using model method
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};
/*
========================
GET CURRENT USER
GET /api/auth/me
========================
*/
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,getMe,
};