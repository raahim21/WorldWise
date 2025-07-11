import express from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import City from "../models/Cities.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/user-cities", verifyToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  console.log(req.user);
  console.log(req.user);
  console.log(req.user);
  console.log(req.user);
  console.log(req.user._id);
  console.log(req.user._id);

  try {
    const userID = new mongoose.Types.ObjectId(req.user.id);
    const userCities = await City.find({ user: userID });
    console.log(userCities);

    console.log(userCities);
    console.log(userCities);
    console.log(userCities);

    res.json(userCities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET all cities for a specific user
router.get("/", verifyToken, async (req, res) => {
  console.log(req.user);
  console.log(req.user);
  console.log(req.user);
  console.log(req.user);
  console.log(req.user._id);
  console.log(req.user._id);
  try {
    const citiesData = await City.find({
      user: new mongoose.Types.ObjectId(req.user._id),
    });
    res.json(citiesData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a single city by ID
router.get("/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const city = await City.findById(id);

    if (!city) return res.status(404).json({ message: "City not found" });

    res.json(city);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a city by ID (POST method used, ideally should be DELETE)

// CREATE a new city
router.post("/", verifyToken, async (req, res) => {
  try {
    const { cityName, country, emoji, date, notes, position } = req.body;

    if (!cityName || !country || !position?.lat || !position?.lng || !notes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCity = await City.create({
      cityName,
      country,
      emoji,
      date,
      notes,
      position,
      user: new mongoose.Types.ObjectId(req.user._id), // use _id consistently
    });

    res.status(201).json(newCity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const cityID = req.params.id;
    await City.deleteOne({ _id: cityID });
    res.json({ message: "Deleting successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
});

// GET cities for the authenticated user only

export default router;
