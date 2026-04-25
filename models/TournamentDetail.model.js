const mongoose = require("mongoose");

const tournamentDetailSchema = new mongoose.Schema(
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

const TournamentDetail = mongoose.model("TournamentDetail", tournamentDetailSchema);
module.exports = TournamentDetail;
