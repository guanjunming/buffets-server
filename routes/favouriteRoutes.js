const express = require("express");
const {
  addFavourites,
  getAllFavourites,
} = require("../controllers/favouriteController");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.post("/:id", checkAuth, addFavourites);
router.get("/", checkAuth, getAllFavourites);

module.exports = router;
