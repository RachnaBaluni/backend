const mongoose = require("mongoose");

const academySchema = new mongoose.Schema(
  {
    academyName: {
      type: String,
      required: true,
      trim: true,
    },
    academyAddress: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[6-9]\d{9}$/, // Basic Indian mobile number regex
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    },
    website: {
      type: String,
      trim: true,
      // You might add a more robust URL validation if needed
    },
    numberOfCoaches: {
      type: Number,
      required: true,
      min: 0,
    },
    numberOfPlayers: {
      type: Number,
      required: true,
      min: 0,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    // alternativeEmailAddress removed
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "UnVerified"
    },
  },
  { timestamps: true }
);

const Academy = mongoose.model("MemberAcademy", academySchema);
module.exports = Academy;
