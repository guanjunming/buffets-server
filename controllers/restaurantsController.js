const Restaurant = require("../models/Restaurant");
const seedRestaurants = require("../seeds/seedRestaurants");
const CustomError = require("../utils/customError");

const seedRestaurantsData = async (req, res, next) => {
  try {
    await Restaurant.deleteMany({});

    await Restaurant.insertMany(seedRestaurants);
    res.json({ status: "success", message: "Seeding successful" });
  } catch (error) {
    return next(new CustomError("Seeding failed", 500));
  }
};

const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    return next(new CustomError("Failed to fetch restaurants.", 500));
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(
        new CustomError("No restaurant found with provided id.", 404)
      );
    }
    res.json(restaurant);
  } catch (error) {
    return next(new CustomError("Failed to fetch restaurant.", 500));
  }
};

module.exports = { seedRestaurantsData, getRestaurants, getRestaurantById };
