const express = require("express");
const {
  seedRestaurantsData,
  getRestaurants,
} = require("../controllers/restaurants");
const router = express.Router();

router.get("/restaurants/seed", seedRestaurantsData);
router.get("/restaurants", getRestaurants);

module.exports = router;
