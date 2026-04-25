// models/MemberDistrict.model.js
const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    districtName: {
      type: String,
      required: true,
      trim: true,
      unique: true, // District names should likely be unique
      enum: [
        // Added enum for specific district names
        "Almora",
        "Bageshwar",
        "Chamoli",
        "Champawat",
        "Dehradun",
        "Haridwar",
        "Nainital",
        "Pauri Garhwal",
        "Pithoragarh",
        "Rudraprayag",
        "Tehri Garhwal",
        "Udham Singh Nagar",
        "Uttarkashi",
      ],
    },
    presidentName: {
      type: String,
      required: true,
      trim: true,
    },
    presidentEmail: {
      type: String,
      required: true,
      unique: true, // President's email should be unique
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    },
    presidentPhone: {
      type: String,
      required: true,
      unique: true, // President's phone should be unique
      trim: true,
      match: /^[6-9]\d{9}$/, // Basic Indian mobile number regex
    },
    secretaryName: {
      type: String,
      required: true,
      trim: true,
    },
    secretaryEmail: {
      type: String,
      required: true,
      unique: true, // Secretary's email should be unique
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    },
    secretaryPhone: {
      type: String,
      required: true,
      unique: true, // Secretary's phone should be unique
      trim: true,
      match: /^[6-9]\d{9}$/, // Basic Indian mobile number regex
    },
    treasurerName: {
      type: String,
      required: true,
      trim: true,
    },
    treasurerEmail: {
      type: String,
      required: true,
      unique: true, // Treasurer's email should be unique
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    },
    treasurerPhone: {
      type: String,
      required: true,
      unique: true, // Treasurer's phone should be unique
      trim: true,
      match: /^[6-9]\d{9}$/, // Basic Indian mobile number regex
    },
    generalContactEmail: {
      type: String,
      required: true,
      unique: true, // General contact email should be unique
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    },
    generalContactPhone: {
      type: String,
      required: true,
      unique: true, // General contact phone should be unique
      trim: true,
      match: /^[6-9]\d{9}$/, // Basic Indian mobile number regex
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

const District = mongoose.model("MemberDistrict", districtSchema);
module.exports = District;
