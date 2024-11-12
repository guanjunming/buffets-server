require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const restaurantsRoutes = require("./routes/restaurantsRoutes");
const userRoutes = require("./routes/userRoutes");
const CustomError = require("./utils/customError");

connectDB();
const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/restaurants", restaurantsRoutes);
app.use("/api", userRoutes);

app.use((req, res, next) => {
  const error = new CustomError("Can't find route on server.", 404);
  next(error);
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "An unknown error occurred." });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
