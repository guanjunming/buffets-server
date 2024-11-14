const { validationResult } = require("express-validator");
const CustomError = require("../utils/customError");

const checkErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: errors.array().map((el) => el.msg) });
  }

  next();
};

module.exports = checkErrors;
