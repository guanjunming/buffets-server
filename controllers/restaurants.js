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

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurants.find();
    res.json(restaurants);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "error", msg: "Failed to fetch restaurants" });
  }
};

module.exports = { seedRestaurantsData, getRestaurants };
