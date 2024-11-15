const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: [String],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  adultPrice: {
    min: { type: Number, required: true },
    max: { type: Number },
  },
  childPrice: {
    min: { type: Number },
    max: { type: Number },
  },
  description: {
    type: String,
    required: true,
  },
  cuisine: {
    type: [String],
    required: true,
  },
  website: {
    type: String,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
