const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
  try {
    //console.log("📩 Registering:", req.body);

    const { fullName, email, password } = req.body;

    if (!fullName || !fullName.firstName || !fullName.lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      fullName: { firstName: fullName.firstName, lastName: fullName.lastName },
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET , { expiresIn: "7d" });
    res.cookie('token', token, { httpOnly: true, secure: false }); // secure:false for local

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ,{ expiresIn: "7d" });
    res.cookie('token', token, { httpOnly: true, secure: false });

    res.status(200).json({
      message: "User login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = { registerUser, loginUser };
