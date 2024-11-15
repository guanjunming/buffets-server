const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const catchAsync = require("../utils/catchAsync");

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

router.get("/users/:id", userController.getUserProfileById);

module.exports = router;
