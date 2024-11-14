const { body } = require("express-validator");

const validateReviewData = [
  body(
    "title",
    "Title is required and must have a maximum of 120 characters."
  ).isLength({
    min: 1,
    max: 120,
  }),
  //   body("review", "Review must have a minimum of 100 characters.").isLength({
  //     min: 100,
  //   }),
  body("rating", "Rating must be between 1 to 5.").isInt({ min: 1, max: 5 }),
];

module.exports = { validateReviewData };
