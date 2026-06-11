const mongoose = require("mongoose");

const academySchema = new mongoose.Schema(
  {
    academyName: {
      type: String,
      required: true,
    },
    academyAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      default: "",
    },
    numberOfCoaches: {
      type: Number,
      default: 0,
    },
    numberOfPlayers: {
      type: Number,
      default: 0,
    },
    registrationNumber: {
      type: String,
      default: "",
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
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Academy", academySchema, "memberacademies");
