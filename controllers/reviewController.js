const Review = require("../models/Review");
const CustomError = require("../utils/customError");

const createReview = async (req, res, next) => {
  try {
    const { title, review, rating } = req.body;

    const newReview = await Review.create({
      restaurant: req.params.id,
      user: req.user.id,
      title,
      review,
      rating,
    });

    res.status(201).json(newReview);
  } catch (error) {
    next(new CustomError("Failed to create review.", 500));
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { title, review, rating } = req.body;

    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return next(new CustomError("Review not found.", 404));
    }

    if (!existingReview.user.equals(req.user.id)) {
      return next(new CustomError("Unauthorized to update this review.", 403));
    }

    existingReview.title = title;
    existingReview.review = review;
    existingReview.rating = rating;
    existingReview.updatedAt = Date.now();

    await existingReview.save();
    res.json(existingReview);
  } catch (error) {
    next(new CustomError("Failed to update review.", 500));
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return next(new CustomError("Review not found.", 404));
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

const seedReviews = async (req, res, next) => {
  await Review.deleteMany({});

  await Review.insertMany([
    {
      restaurant: "6734788f50c469dd17490a98",
      user: "672dc8f739b455eaafe67263",
      title: "Excellent Buffet",
      review: "The food selection is amazing, and everything tasted great!",
      rating: 5,
    },
    {
      restaurant: "6734788f50c469dd17490a98",
      user: "6735bf259f6de82081d8db7e",
      title: "Good value for money",
      review: "Great variety for the price. Will visit again!",
      rating: 4,
    },
    {
      restaurant: "6734788f50c469dd17490a99",
      user: "6735bf259f6de82081d8db7e",
      title: "Average Experience",
      review: "The food was decent, but a bit overpriced in my opinion.",
      rating: 3,
    },
    {
      restaurant: "6734788f50c469dd17490a99",
      user: "672dc8f739b455eaafe67263",
      title: "Amazing ambiance",
      review: "Loved the decor and the food selection was great!",
      rating: 4,
    },
  ]);

  res.json({ message: "Review seeded successfully." });
};

module.exports = { createReview, updateReview, deleteReview, seedReviews };
