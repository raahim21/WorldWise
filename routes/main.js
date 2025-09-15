// import express from "express";
// import { verifyToken } from "../middlewares/authMiddleWare.js";
// import City from "../models/Cities.js";
// import mongoose from "mongoose";

// const router = express.Router();

// router.get("/user-cities", verifyToken, async (req, res) => {
//   if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const userID = new mongoose.Types.ObjectId(req.user.id);
//     const userCities = await City.find({ user: userID });

//     res.json(userCities);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // GET all cities for a specific user
// router.get("/", verifyToken, async (req, res) => {
//   try {
//     const citiesData = await City.find({
//       user: new mongoose.Types.ObjectId(req.user._id),
//     });
//     res.json(citiesData);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET a single city by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const id = new mongoose.Types.ObjectId(req.params.id);
//     const city = await City.findById(id);

//     if (!city) return res.status(404).json({ message: "City not found" });

//     res.json(city);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE a city by ID (POST method used, ideally should be DELETE)

// // CREATE a new city
// router.post("/", verifyToken, async (req, res) => {
//   console.log(req.user);
//   try {
//     const { cityName, country, emoji, date, notes, position } = req.body;

//     if (!cityName || !country || !position?.lat || !position?.lng || !notes) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const newCity = await City.create({
//       cityName,
//       country,
//       emoji,
//       date,
//       notes,
//       position,
//       user: new mongoose.Types.ObjectId(req.user.id), // use _id consistently
//     });

//     res.status(201).json(newCity);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// router.post("/delete/:id", verifyToken, async (req, res) => {
//   try {
//     const cityID = new mongoose.Types.ObjectId(req.params.id);
//     await City.deleteOne({ _id: cityID });
//     res.json({ message: "Deleting successful!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "There was an error" });
//   }
// });

// // GET cities for the authenticated user only

// export default router;

import express from "express";
import mongoose from "mongoose";
import City from "../models/City.js"; // Fixed case (was Cities.js)
import { verifyToken } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// GET /api/cities/user-cities (Authenticated user's cities)
router.get("/user-cities", verifyToken, async (req, res) => {
  try {
    const userID = new mongoose.Types.ObjectId(req.user.id); // Fixed: use .id
    const userCities = await City.find({ user: userID });
    res.status(200).json(userCities);
  } catch (err) {
    console.error("Get user cities error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/cities (All cities for authenticated user)
router.get("/", verifyToken, async (req, res) => {
  try {
    const citiesData = await City.find({
      user: new mongoose.Types.ObjectId(req.user.id), // Fixed: use .id
    });
    if (!citiesData.length) {
      return res.status(404).json({ error: "No cities found for user" });
    }
    res.status(200).json(citiesData);
  } catch (err) {
    console.error("Get cities error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/cities/:id (Single city, public for now)
router.get("/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(200).json(city);
  } catch (err) {
    console.error("Get city error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/cities (Create new city)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { cityName, country, emoji, date, notes, position } = req.body;

    // Validation
    if (!cityName || !country || !position?.lat || !position?.lng || !notes) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCity = await City.create({
      cityName,
      country,
      emoji,
      date,
      notes,
      position,
      user: new mongoose.Types.ObjectId(req.user.id), // Fixed: use .id
    });

    res.status(201).json(newCity);
  } catch (err) {
    console.error("Create city error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/cities/delete/:id (Should be DELETE method)
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const cityID = new mongoose.Types.ObjectId(req.params.id);
    const city = await City.findOne({
      _id: cityID,
      user: new mongoose.Types.ObjectId(req.user.id), // Ownership check
    });
    if (!city) {
      return res.status(404).json({ error: "City not found or not yours" });
    }
    await City.deleteOne({ _id: cityID });
    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    console.error("Delete city error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
