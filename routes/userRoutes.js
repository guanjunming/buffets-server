const express = require("express");
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/signup", catchAsync(authController.signup));
router.post("/login", catchAsync(authController.login));
router.post("/refresh", authController.refresh);

module.exports = router;
