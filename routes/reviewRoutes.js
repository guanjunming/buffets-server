const express = require("express");
const catchAsync = require("../utils/catchAsync");
const checkAuth = require("../middleware/checkAuth");
const reviewController = require("../controllers/reviewController");
const { validateReviewData } = require("../validators/reviewValidators");
const checkErrors = require("../validators/checkErrors");
const { validateIdInParam } = require("../validators/commonValidators");

const router = express.Router();

router.get("/reviews/seed", catchAsync(reviewController.seedReviews));

router.use(checkAuth);

router.get(
  "/restaurants/:id/review",
  validateIdInParam,
  checkErrors,
  reviewController.getReviewByRestaurantId
);

router.post(
  "/restaurants/:id/review",
  validateIdInParam,
  validateReviewData,
  checkErrors,
  reviewController.createReview
);

router.patch(
  "/reviews/:id",
  validateIdInParam,
  validateReviewData,
  checkErrors,
  reviewController.updateReview
);

router.delete(
  "/reviews/:id",
  validateIdInParam,
  checkErrors,
  reviewController.deleteReview
);

module.exports = router;
