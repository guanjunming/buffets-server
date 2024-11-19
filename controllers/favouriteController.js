const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const CustomError = require("../utils/customError");

const getAllFavourites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favourites",
      populate: { path: "reviews", select: "rating" },
    });

    if (!user) {
      return next(new CustomError("No user found with provided id.", 404));
    }

    return res.json(user.favourites);
  } catch (error) {
    return next(new CustomError("Failed to get favourites.", 500));
  }
};

const addFavourites = async (req, res, next) => {
  try {
    const { id: restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return next(
        new CustomError("No restaurant found with provided id.", 404)
      );
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new CustomError("No user found with provided id.", 404));
    }

    if (user.favourites.includes(restaurantId)) {
      return next(new CustomError("Restaurant already in favourites.", 400));
    }

    user.favourites.push(restaurantId);
    await user.save();

    return res.json({ message: "Restaurant added to favorites." });
  } catch (error) {
    return next(new CustomError("Failed to add favourites.", 500));
  }
};

const removeFavourite = async (req, res, next) => {
  try {
    const { id: restaurantId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new CustomError("No user found with provided id.", 404));
    }

    user.favourites = user.favourites.filter(
      (fav) => fav.toString() !== restaurantId
    );

    await user.save();

    res.json({ message: "Restaurant removed from favourites." });
  } catch (error) {
    return next(new CustomError("Failed to remove from favourites.", 500));
  }
};

module.exports = {
  addFavourites,
  getAllFavourites,
  removeFavourite,
};
