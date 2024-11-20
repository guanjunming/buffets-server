const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  ],
  profileImage: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  if (!this.profileImage) {
    const randIdx = Math.floor(Math.random() * 10) + 1;
    this.profileImage = `public/images/default-avatar-${randIdx}.jpg`;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
