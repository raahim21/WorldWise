// import express from "express";
// import authRoutes from "./routes/auth.js";
// import MainPage from "./routes/main.js";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import cors from "cors";

// // import { verifyToken } from "./middlewares/authMiddleWare.js";

// let app = express();
// dotenv.config();

// app.use(
//   cors({
//     origin: "https://worldsetsearch.netlify.app",
//     credentials: true,
//   })
// );

// // app.options("*", cors()); // handle preflight

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/cities", MainPage);

// // const mongoose = require("mongoose");
// import mongoose from "mongoose";
// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     app.listen(3001);
//     console.log("MongoDB connected!");
//   } catch (err) {
//     console.error("Connection error:", err);
//   }
// }

// connectDB();

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/auth.js";
import citiesRouter from "./routes/main.js"; // Renamed from cities.js in your code

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://worldsetsearch.netlify.app"
        : ["http://localhost:5173", "https://worldsetsearch.netlify.app"],
    credentials: true, // Allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Health check route for Railway
app.get("/", (req, res) => {
  res.status(200).json({ message: "WorldWise API is running!" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cities", citiesRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server - Bind to 0.0.0.0 for Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (host: 0.0.0.0)`);
});
