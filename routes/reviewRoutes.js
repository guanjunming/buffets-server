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
  "/:id", // restaurant id
  validateIdInParam,
  checkErrors,
  reviewController.getReviewByRestaurantId
);

router.post(
  "/:id", // restaurant id
  validateIdInParam,
  validateReviewData,
  checkErrors,
  reviewController.createorUpdateReview
);

router.patch(
  "/:id", // review id
  validateIdInParam,
  validateReviewData,
  checkErrors,
  reviewController.updateReview
);

router.delete(
  "/:id", // review id
  validateIdInParam,
  checkErrors,
  reviewController.deleteReview
);

module.exports = router;
