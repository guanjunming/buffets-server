const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

const addFavourites = async (req, res) => {
  const userId = req.user.id;
  const { id: restaurantId } = req.params;

  console.log("userId:", userId);
  console.log(req.user);
  console.log("restaurantId:", restaurantId);

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.log("Restaurant not found:", restaurantId);
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const user = await User.findById(userId);
    if (!user.favourites.includes(restaurantId)) {
      user.favourites.push(restaurantId);
      await user.save();
      console.log("Restaurant added to favorites:", restaurantId);
      return res.status(200).json({ message: "Restaurant added to favorites" });
    } else {
      console.log("Restaurant already in favorites:", restaurantId);
      return res
        .status(400)
        .json({ message: "Restaurant already in favorites" });
    }
  } catch (error) {
    console.error("Error in addFavourites:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
};

const getAllFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId:", userId);
    console.log(req.user);

    const user = await User.findById(userId).populate("favourites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.favourites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addFavourites,
  getAllFavourites,
};
