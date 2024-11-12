const { validationResult } = require("express-validator");
const CustomError = require("../utils/customError");

const checkErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("Invalid inputs.", 422));
  }

  next();
};

module.exports = checkErrors;
