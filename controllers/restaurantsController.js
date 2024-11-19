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
    const restaurants = await Restaurant.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "restaurant",
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: {
                $round: [{ $avg: "$reviews.rating" }, 1],
              },
              else: 0,
            },
          },
        },
      },
      {
        $project: { reviews: 0 }, // exclude reviews
      },
    ]);

    res.json(restaurants);
  } catch (error) {
    return next(new CustomError("Failed to fetch restaurants", 500));
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } },
      populate: { path: "user", select: "name" },
    });

    if (!restaurant) {
      return next(new CustomError("No restaurant found with provided id", 404));
    }

    res.json(restaurant);
  } catch (error) {
    return next(new CustomError("Failed to fetch restaurant", 500));
  }
};

const getRestaurantsMaxPriceCuisines = async (req, res, next) => {
  try {
    const restaurantsMaxPrice = await Restaurant.aggregate([
      { $group: { _id: null, maxPrice: { $max: "$adultPrice.min" } } },
      { $project: { _id: 0, maxPrice: 1 } },
    ]);
    const cuisines = await Restaurant.distinct("cuisine");
    res.json({ maxPrice: restaurantsMaxPrice[0].maxPrice, cuisines });
  } catch (error) {
    return next(
      new CustomError(
        "Failed to fetch maximum price and cuisines of all restaurants",
        500
      )
    );
  }
};

const getRestaurantsByQuery = async (req, res, next) => {
  try {
    const search = req.query?.search
      ? req.query?.search.replace(/[^a-zA-Z0-9]/g, "")
      : "";
    const cuisines = await Restaurant.distinct("cuisine");
    const selectedCuisine = req.query?.cuisine
      ? req.query?.cuisine.split("c").map((item) => cuisines[parseInt(item)])
      : cuisines;
    const sortBy = req.query?.sortBy === "price" ? "adultPrice.min" : "name";
    const sortOrder = req.query?.sortOrder === "desc" ? -1 : 1;

    const restaurants = await Restaurant.find({
      $and: [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { cuisine: { $elemMatch: { $regex: search, $options: "i" } } },
          ],
        },
        { cuisine: { $in: selectedCuisine } },
        {
          "adultPrice.min": {
            $gte: req.query?.minPrice || 0,
            $lte: req.query?.maxPrice || Infinity,
          },
        },
      ],
    })
      .populate("reviews", "rating")
      .sort({ [sortBy]: sortOrder });

    res.json(restaurants);
  } catch (error) {
    return next(new CustomError("Failed to fetch restaurants by query", 500));
  }
};

const getRestaurantsByNearest = async (req, res, next) => {
  const { longitude, latitude } = req.body;

  try {
    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance", // distance in meters
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "restaurant",
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: {
                $round: [{ $avg: "$reviews.rating" }, 1],
              },
              else: 0,
            },
          },
        },
      },

      {
        $project: { reviews: 0 }, // exclude reviews
      },
    ]);

    res.json(restaurants);
  } catch (error) {
    return next(new CustomError("Failed to fetch nearest restaurants", 500));
  }
};

module.exports = {
  seedRestaurantsData,
  getRestaurants,
  getRestaurantById,
  getRestaurantsMaxPriceCuisines,
  getRestaurantsByQuery,
  getRestaurantsByNearest,
};
