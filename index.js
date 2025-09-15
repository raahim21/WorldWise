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
import authRouter from "./routes/auth.js"; // Your auth routes
import citiesRouter from "./routes/main.js"; // Your cities routes

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    // origin: "https://worldsetsearch.netlify.app", // Adjust to your frontend URL
    origin: ["http://localhost:5173", "https://worldsetsearch.netlify.app"], // Adjust to your frontend URL

    credentials: true, // Allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cities", citiesRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
