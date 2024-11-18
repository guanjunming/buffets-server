const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const CustomError = require("../utils/customError");

const addFavourites = async (req, res) => {
  const userId = req.user.id;
  const { id: restaurantId } = req.params;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return next(new CustomError("No restaurant found with provided id", 404));
    }

    const user = await User.findById(userId);
    if (!user.favourites.includes(restaurantId)) {
      user.favourites.push(restaurantId);
      await user.save();

      return res.status(200).json({ message: "Restaurant added to favorites" });
    } else {
      return next(new CustomError("Restaurant already in favourites", 400));
    }
  } catch (error) {
    return next(new CustomError("Failed to add favourites", 500));
  }
};

const getAllFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favourites");

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    return res.status(200).json(user.favourites);
  } catch (error) {
    console.error(error);
    return next(new CustomError("Failed to get favourites", 500));
  }
};

const removeFavourite = async (req, res) => {
  const userId = req.user.id;
  const { id: restaurantId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    user.favourites = user.favourites.filter(
      (fav) => fav.toString() !== restaurantId
    );

    await user.save();

    res.status(200).json({ message: "Restaurant removed from favourites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addFavourites,
  getAllFavourites,
  removeFavourite,
};
