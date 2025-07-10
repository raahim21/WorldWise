// import express from "express";
// import { verifyToken } from "../middlewares/authMiddleWare.js";
// import City from "../models/Cities.js";

// const router = express.Router();

// router.get("/cities", verifyToken, async function (req, res) {
//   let citiesData = await City.find({ user: req.user._id });
//   res.json(citiesData);
// });

// router.get("/cities/:id", async (req, res) => {
//   const id = req.params.id;
//   const city = await City.findById(id);

//   if (!city) return res.status(404).json({ message: "City not found" });

//   res.json(city);
// });

// // controllers/cityController.js

// router.post("/delete-city/:id", verifyToken, async function (req, res) {
//   try {
//     let cityID = req.params.id;
//     await City.deleteOne({ _id: cityID });
//     res.json({ message: "Deleting successfull!" });
//   } catch (err) {
//     console.log(err);
//     res.json({ message: "THere was an error" });
//   }
// });

// router.post("/create-city", verifyToken, async function (req, res) {
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
//       user: req.user.id,
//     });

//     res.status(201).json(newCity);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// router.get("/user-cities", verifyToken, async function (req, res) {
//   if (!req.user) return;

//   try {
//     let userID = req.user.id;
//     let userCities = await City.find({ user: userID });
//     console.log(userCities);
//     res.json(userCities);
//   } catch (error) {
//     res.json({ message: "Something went wrong" });
//   }
// });

// export default router;

// routes/cities.js

import express from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import City from "../models/Cities.js";

const router = express.Router();

// GET all cities for a specific user
router.get("/cities", verifyToken, async (req, res) => {
  try {
    const citiesData = await City.find({ user: req.user.id });
    res.json(citiesData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a single city by ID
router.get("/cities/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const city = await City.findById(id);

    if (!city) return res.status(404).json({ message: "City not found" });

    res.json(city);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a city by ID (POST method used, ideally should be DELETE)
router.post("/delete-city/:id", verifyToken, async (req, res) => {
  try {
    const cityID = req.params.id;
    await City.deleteOne({ _id: cityID });
    res.json({ message: "Deleting successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
});

// CREATE a new city
router.post("/create-city", verifyToken, async (req, res) => {
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
      user: req.user.id, // use _id consistently
    });

    res.status(201).json(newCity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET cities for the authenticated user only
router.get("/user-cities", verifyToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const userID = req.user.id;
    const userCities = await City.find({ user: userID });
    res.json(userCities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
