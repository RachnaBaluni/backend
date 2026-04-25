const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    rules: {
      type: [String],
      default: [],
    },
    showing: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", venueSchema);
module.exports = Venue;
