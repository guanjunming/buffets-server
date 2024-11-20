const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");
const CustomError = require("../utils/customError");
const seedReviews = require("../seeds/seedReviews");

const seedReviewsData = async (req, res, next) => {
  try {
    await Review.deleteMany({});
    await Review.insertMany(seedReviews);
    res.json({ message: "Seeding reviews successful." });
  } catch (error) {
    return next(new CustomError("Seeding reviews failed.", 500));
  }
};

const getReviewByRestaurantId = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(
        new CustomError("No restaurant found with provided id.", 404)
      );
    }

    const review = await Review.findOne({
      user: req.user.id,
      restaurant: req.params.id,
    });

    res.json(review);
  } catch (error) {
    next(new CustomError("Failed to fetch restaurant review.", 500));
  }
};

const createorUpdateReview = async (req, res, next) => {
  try {
    const { title, review, rating } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(
        new CustomError("No restaurant found with provided id.", 404)
      );
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      restaurant: req.params.id,
    });

    let message;
    let statusCode = 200;

    if (existingReview) {
      existingReview.title = title;
      existingReview.review = review;
      existingReview.rating = rating;

      await existingReview.save();
      message = "Review updated successfully.";
    } else {
      await Review.create({
        restaurant: req.params.id,
        user: req.user.id,
        title,
        review,
        rating,
      });
      message = "Review created successfully.";
      statusCode = 201;
    }

    res.status(statusCode).json({ message });
  } catch (error) {
    next(new CustomError("Failed to create or update review.", 500));
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { title, review, rating } = req.body;

    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return next(new CustomError("No review found with provided id.", 404));
    }

    if (!existingReview.user.equals(req.user.id)) {
      return next(new CustomError("Unauthorized to update this review.", 403));
    }

    existingReview.title = title;
    existingReview.review = review;
    existingReview.rating = rating;

    await existingReview.save();
    res.json({ message: "Review updated successfully." });
  } catch (error) {
    next(new CustomError("Failed to update review.", 500));
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return next(new CustomError("No review found with provided id.", 404));
    }

    if (!existingReview.user.equals(req.user.id)) {
      return next(new CustomError("Unauthorized to delete this review.", 403));
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    next(new CustomError("Failed to delete review.", 500));
  }
};

module.exports = {
  getReviewByRestaurantId,
  createorUpdateReview,
  updateReview,
  deleteReview,
  seedReviewsData,
};
