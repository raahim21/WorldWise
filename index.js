import express from "express";
import authRoutes from "./routes/auth.js";
import MainPage from "./routes/main.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// import { verifyToken } from "./middlewares/authMiddleWare.js";

let app = express();
dotenv.config();
app.use(
  cors({
    origin: "https://super-cheesecake-bd5837.netlify.app", // your React frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(MainPage);

// const mongoose = require("mongoose");
import mongoose from "mongoose";
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3001);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("Connection error:", err);
  }
}

connectDB();
