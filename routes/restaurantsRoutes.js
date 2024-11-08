const express = require("express");
const { seedRestaurantsData } = require("../controllers/restaurants");
const router = express.Router();

router.get("/restaurants/seed", seedRestaurantsData);

module.exports = router;
