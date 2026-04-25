const mongoose = require("mongoose");

const mainEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
        type: String,
        required: true,
    },
    organizer: {
        type: String,
        required: true,
    },
    rules: {
      type: String,
      default: "",
    },
    showing: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const MainEvent = mongoose.model("MainEvent", mainEventSchema);
module.exports = MainEvent;