require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const CustomError = require("./utils/customError");
const restaurantsRoutes = require("./routes/restaurantsRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 900,
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();
const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", userRoutes);

// route not found
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
