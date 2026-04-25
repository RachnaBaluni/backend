const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String }, // Optional: convert to Date if needed
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  number: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  experience: { type: Number, required: true },
  academy: { type: String },
  academyPhone: { type: String },
  academyEmail: { type: String },
  password: { type: String, required: true },
  status: {
    type: String,
    default: "UnVerified",
  },
});

module.exports = mongoose.model("Coach", CoachSchema);
