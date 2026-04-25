const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Event",
    },
    partner1: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Player",
    },
    partner2: {
      type: mongoose.Schema.ObjectId,
      required: false,
      default: null,
      ref: "Player",
    },
    rank: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
