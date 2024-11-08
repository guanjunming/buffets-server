const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

const checkAuth = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new CustomError("Authentication failed! Please log in.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    return next(
      new CustomError("Token invalid or expired. Please log in again.", 401)
    );
  }
};

module.exports = checkAuth;
