const express = require("express");
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");
const checkAuth = require("../middleware/checkAuth");
const {
  validateSignupData,
  validateLoginData,
} = require("../validators/userValidators");
const checkErrors = require("../validators/checkErrors");

const router = express.Router();

router.post(
  "/signup",
  validateSignupData,
  checkErrors,
  catchAsync(authController.signup)
);
router.post(
  "/login",
  validateLoginData,
  checkErrors,
  catchAsync(authController.login)
);
router.post("/refresh", authController.refresh);

module.exports = router;
