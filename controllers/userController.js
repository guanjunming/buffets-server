const User = require("../models/User");
const Review = require("../models/Review");
const CustomError = require("../utils/customError");

const getUserProfileById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
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
      user: { name: user.name, email: user.email, createdAt: user.createdAt },
      reviews,
    });
  } catch (error) {
    return next(new CustomError("Failed to fetch user and reviews.", 500));
  }
};

module.exports = { getUserProfileById };
