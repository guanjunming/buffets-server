const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurant_name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  opening_hours: {
    type: String,
    required: true,
  },
  price_range_adult: {
    type: String,
    required: true,
  },
  price_range_child: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
});

module.exports = mongoose.model("Restaurants", restaurantSchema);
