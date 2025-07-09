// models/City.js
import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  cityName: { type: String, required: true },
  country: { type: String, required: true },
  emoji: { type: String },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assumes you have a User model
    required: true,
  },
});

export default mongoose.model("City", citySchema);
