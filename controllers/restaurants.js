const Restaurants = require("../models/Restaurants");

const seedRestaurants = require("../seeds/seedRestaurants");

const seedRestaurantsData = async (req, res) => {
  await Restaurants.deleteMany({});
  try {
    await Restaurants.insertMany(seedRestaurants);
    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.log("seeding error:", error);
    res.status(400).json({ status: "error", msg: error.message });
  }
};

module.exports = { seedRestaurantsData };
