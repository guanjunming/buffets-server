const { body } = require("express-validator");

const validateSignupData = [
  body("name", "Name is required.").trim().notEmpty(),
  body("name", "Name must not exceed 40 characters.").isLength({
    max: 40,
  }),
  body("email", "Email address is required.").notEmpty(),
  body("email", "Email address is invalid.").isEmail(),
  body("password", "Password must be at least 8 characters.").isLength({
    min: 8,
  }),
];

const validateLoginData = [
  body("email", "Email address is required.").notEmpty(),
  body("email", "Email address is invalid.").isEmail(),
  body("password", "Password is required.").notEmpty(),
];

const validatePasswordData = [
  body("passwordCurrent", "Current password is required.").notEmpty(),
  body("passwordNew", "New password must be at least 8 characters.").isLength({
    min: 8,
  }),
];

const validateProfileData = [
  body("name", "Name is required.").trim().notEmpty(),
  body("name", "Name must not exceed 40 characters.").isLength({
    max: 40,
  }),
];

module.exports = {
  validateSignupData,
  validateLoginData,
  validatePasswordData,
  validateProfileData,
};
