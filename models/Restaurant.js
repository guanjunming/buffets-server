const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: [String],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
      required: true,
    },
    adultPrice: {
      min: { type: Number, required: true },
      max: { type: Number },
    },
    childPrice: {
      min: { type: Number },
      max: { type: Number },
    },
    description: {
      type: String,
      required: true,
    },
    cuisine: {
      type: [String],
      required: true,
    },
    website: {
      type: String,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for reviews
restaurantSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "restaurant",
});

restaurantSchema.virtual("reviewCount").get(function () {
  return this.reviews ? this.reviews.length : 0;
});

restaurantSchema.virtual("averageRating").get(function () {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    const avg = sum / this.reviews.length;
    return Math.round(avg * 10) / 10;
  }
  return 0;
});

restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
