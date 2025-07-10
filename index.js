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
    origin: "https://worldsetsearch.netlify.app",
    credentials: true,
  })
);

// app.options("*", cors()); // handle preflight

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/cities", MainPage);

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
