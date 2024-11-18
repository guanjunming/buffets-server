const express = require("express");
const {
  addFavourites,
  getAllFavourites,
  removeFavourite,
} = require("../controllers/favouriteController");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.post("/:id", checkAuth, addFavourites);
router.get("/", checkAuth, getAllFavourites);
router.delete("/:id", checkAuth, removeFavourite);

module.exports = router;
