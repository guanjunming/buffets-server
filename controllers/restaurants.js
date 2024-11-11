const Restaurants = require("../models/Restaurants");

const seedRestaurants = require("../seeds/seedRestaurants");
const CustomError = require("../utils/customError");

const seedRestaurantsData = async (req, res, next) => {
  await Restaurants.deleteMany({});
  try {
    await Restaurants.insertMany(seedRestaurants);
    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    return next(new CustomError("seeding error:", 400));
  }
};

const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurants.find();
    res.json(restaurants);
  } catch (error) {
    return next(new CustomError("Failed to fetch restaurants:", 500));
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurants.findById(req.body.id);
    res.json(restaurant);
  } catch (error) {
    return next(new CustomError("Error getting restaurant:", 400));
  }
};

module.exports = { seedRestaurantsData, getRestaurants, getRestaurantById };
