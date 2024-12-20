require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const CustomError = require("./utils/customError");
const restaurantsRoutes = require("./routes/restaurantsRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();
const app = express();

app.use(cors());
app.use(helmet());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use("/api", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));

// routes
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", userRoutes);
app.use("/api/favourites", favouriteRoutes);

// route not found
app.use((req, res, next) => {
  const error = new CustomError(
    `Can't find route ${req.originalUrl} on server.`,
    404
  );
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
app.listen(PORT);
