const express = require("express");
const restaurantsController = require("../controllers/restaurantsController");
const { validateIdInParam } = require("../validators/commonValidators");
const checkErrors = require("../validators/checkErrors");

const router = express.Router();

router.get("/seed", restaurantsController.seedRestaurantsData);
router.get("/", restaurantsController.getRestaurants);
router.get(
  "/maxpricecuisines",
  restaurantsController.getRestaurantsMaxPriceCuisines
);
router.get("/search", restaurantsController.getRestaurantsByQuery);
router.get(
  "/:id",
  validateIdInParam,
  checkErrors,
  restaurantsController.getRestaurantById
);
router.post("/nearest", restaurantsController.getRestaurantsByNearest);

module.exports = router;
