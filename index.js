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
import citiesRouter from "./routes/main.js";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://worldsetsearch.netlify.app"
        : ["http://localhost:5173", "https://worldsetsearch.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Health check and root routes
app.get("/", (req, res) => {
  console.log("Root endpoint hit from:", req.ip); // Log to see if Railway hits it
  res.status(200).send("Server is alive");
});

app.get("/health", (req, res) => {
  console.log("Health check hit from:", req.ip);
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cities", citiesRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
});
