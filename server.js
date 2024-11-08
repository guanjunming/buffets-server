require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const CustomError = require("./utils/customError");

const userRoutes = require("./routes/userRoutes");
const restaurantsRoutes = require("./routes/restaurantsRoutes");

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", userRoutes);
app.use("/api", restaurantsRoutes);

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
