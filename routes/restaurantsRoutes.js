const express = require("express");
const {
  seedRestaurantsData,
  getRestaurants,
  getRestaurantById,
} = require("../controllers/restaurants");
const { validateIdInBody } = require("../validators/restaurants");
const checkErrors = require("../validators/checkErrors");
const router = express.Router();

router.get("/restaurants/seed", seedRestaurantsData);
router.get("/restaurants", getRestaurants);
router.post("/restaurants", validateIdInBody, checkErrors, getRestaurantById);

module.exports = router;
