const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    shirtSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: true,
    },
    shortSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: true,
    },
    foodPref: {
      type: String,
      enum: ["Veg", "Non-Veg"],
    },
    stay: {
      type: Boolean,
      required: true,
    },
    feePaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    feePaidAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    transactionDetails: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
