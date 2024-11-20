const User = require("../models/User");
const Review = require("../models/Review");
const CustomError = require("../utils/customError");
const seedUsers = require("../seeds/seedUsers");

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new CustomError("No user found with provided id.", 404));
    }

    const reviews = await Review.aggregate([
      { $match: { user: user._id } },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurant",
          foreignField: "_id",
          as: "restaurantDetails",
        },
      },
      { $unwind: "$restaurantDetails" },
      {
        $lookup: {
          from: "reviews",
          localField: "restaurant",
          foreignField: "restaurant",
          as: "allReviews",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          title: 1,
          review: 1,
          rating: 1,
          createdAt: 1,
          restaurant: {
            _id: "$restaurantDetails._id",
            name: "$restaurantDetails.name",
            img: "$restaurantDetails.img",
            reviewCount: { $size: "$allReviews" },
            averageRating: {
              $cond: {
                if: { $gt: [{ $size: "$allReviews" }, 0] },
                then: { $round: [{ $avg: "$allReviews.rating" }, 1] },
                else: 0,
              },
            },
          },
        },
      },
    ]);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        createdAt: user.createdAt,
        profileImage: user.profileImage,
      },
      reviews,
    });
  } catch (error) {
    return next(new CustomError("Failed to fetch user and reviews.", 500));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -favourites"
    );
    if (!user) {
      return next(new CustomError("No user found with provided id.", 404));
    }

    res.json(user);
  } catch (error) {
    return next(new CustomError("Failed to fetch user.", 500));
  }
};

const seedUsersData = async (req, res, next) => {
  try {
    await User.deleteMany({});
    await User.insertMany(seedUsers);
    res.json({ status: "success", message: "Seeding successful" });
  } catch (error) {
    return next(new CustomError("Seeding failed", 500));
  }
};

module.exports = { getUserProfile, getUserById, seedUsersData };
