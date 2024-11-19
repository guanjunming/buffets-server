const express = require("express");
const favouriteController = require("../controllers/favouriteController");
const checkAuth = require("../middleware/checkAuth");
const { validateIdInParam } = require("../validators/commonValidators");
const checkErrors = require("../validators/checkErrors");

const router = express.Router();

router.get("/", checkAuth, favouriteController.getAllFavourites);
router.post(
  "/:id",
  checkAuth,
  validateIdInParam,
  checkErrors,
  favouriteController.addFavourites
);
router.delete(
  "/:id",
  checkAuth,
  validateIdInParam,
  checkErrors,
  favouriteController.removeFavourite
);

module.exports = router;
