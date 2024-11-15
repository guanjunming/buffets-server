const express = require("express");
const restaurantsController = require("../controllers/restaurantsController");
const {
  validateIdInParam,
  validateIdInBody,
} = require("../validators/restaurants");
const checkErrors = require("../validators/checkErrors");

const router = express.Router();

router.get("/seed", restaurantsController.seedRestaurantsData);
router.get("/", restaurantsController.getRestaurants);
router.get("/maxprice", restaurantsController.getRestaurantsMaxPrice);
router.get("/search", restaurantsController.getRestaurantsByQuery);
router.get(
  "/:id",
  validateIdInParam,
  checkErrors,
  restaurantsController.getRestaurantById
);

module.exports = router;
