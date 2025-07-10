import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";
const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // store this in .env

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // only over HTTPS
  sameSite: "None", // or 'Lax' for login pages
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};
// POST /signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

    // const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    res.status(201).json({ user: { id: newUser._id, email: newUser.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getUser", verifyToken, async function (req, res) {
  try {
    let user = await User.findById(req.user.id).select("-password");
    if (!user) return res.json({ message: "user not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // res.cookie("token", token, COOKIE_OPTIONS);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None", // or 'lax'
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/logout", function (req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

export default router;
