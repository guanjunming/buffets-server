const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const {
  validateSignupData,
  validateLoginData,
  validatePasswordData,
  validateProfileData,
} = require("../validators/userValidators");
const checkErrors = require("../validators/checkErrors");
const checkAuth = require("../middleware/checkAuth");
const { validateIdInParam } = require("../validators/commonValidators");

const router = express.Router();

router.get("/seed", userController.seedUsersData);

router.post("/signup", validateSignupData, checkErrors, authController.signup);
router.post("/login", validateLoginData, checkErrors, authController.login);
router.post("/refresh", authController.refresh);

router.patch(
  "/updatePassword",
  checkAuth,
  validatePasswordData,
  checkErrors,
  authController.updatePassword
);
router.patch(
  "/updateProfile",
  checkAuth,
  validateProfileData,
  checkErrors,
  authController.updateProfile
);

router.get("/profile", checkAuth, userController.getUserProfile);

router.get(
  "/users/:id",
  validateIdInParam,
  checkErrors,
  userController.getUserById
);

module.exports = router;
