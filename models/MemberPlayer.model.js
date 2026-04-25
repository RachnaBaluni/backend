const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    academy: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "UnVerified",
    },
  },
  { timestamps: true }
);

const Player = mongoose.model("MemberPlayer", playerSchema);
module.exports = Player;
