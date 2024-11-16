const express = require("express");
const restaurantsController = require("../controllers/restaurantsController");
const { validateIdInParam } = require("../validators/commonValidators");
const checkErrors = require("../validators/checkErrors");

const router = express.Router();

router.get("/seed", restaurantsController.seedRestaurantsData);
router.get("/", restaurantsController.getRestaurants);
router.get("/maxprice", restaurantsController.getRestaurantsMaxPrice);
router.get("/cuisines", restaurantsController.getRestaurantsCuisines);
router.get("/search", restaurantsController.getRestaurantsByQuery);
router.get(
  "/:id",
  validateIdInParam,
  checkErrors,
  restaurantsController.getRestaurantById
);

module.exports = router;
