const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../utils/customError");

const sendAccessToken = (user, statusCode, res) => {
  const claims = {
    id: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(claims, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(claims, process.env.REFRESH_SECRET, {
    expiresIn: "30d",
  });

  user.password = undefined;
  user.favourites = undefined;

  res.status(statusCode).json({
    accessToken,
    refreshToken,
    user,
  });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    return next(
      new CustomError("This email address has already been registered.", 422)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  sendAccessToken(newUser, 201, res);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return next(
      new CustomError("You have entered an incorrect email or password.", 401)
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(
      new CustomError("You have entered an incorrect email or password.", 401)
    );
  }

  sendAccessToken(user, 200, res);
};

const refresh = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new CustomError("No refresh token provided.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const claims = {
      id: decoded.id,
      email: decoded.email,
    };

    const accessToken = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken, userId: claims.id });
  } catch (error) {
    return next(new CustomError("Invalid refresh token.", 401));
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { passwordCurrent, passwordNew } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new CustomError("No user found with provided id.", 404));
    }

    const isSamePassword = await bcrypt.compare(passwordCurrent, user.password);
    if (!isSamePassword) {
      return next(new CustomError("Current password is incorrect.", 403));
    }

    const hashedPassword = await bcrypt.hash(passwordNew, 12);
    user.password = hashedPassword;
    await user.save();

    sendAccessToken(user, 200, res);
  } catch (error) {
    next(new CustomError("Failed to update password.", 500));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(new CustomError("No user found with provided id.", 404));
    }

    res.json({
      message: "success",
      data: { name: updatedUser.name },
    });
  } catch (error) {
    next(new CustomError("Failed to update profile.", 500));
  }
};

module.exports = { signup, login, refresh, updatePassword, updateProfile };
