const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../utils/customError");

const sendAccessToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  res
    .status(statusCode)
    .json({ userId: user.id, email: user.email, token: token });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    return next(
      new CustomError("This email address has already been registered.", 422)
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

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
    return next(new CustomError("Invalid email or password.", 401));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(new CustomError("Invalid email or password.", 401));
  }

  sendAccessToken(user, 200, res);
};

exports.signup = signup;
exports.login = login;
