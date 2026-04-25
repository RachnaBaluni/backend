const express = require("express");
const {
  getAllVenue
} = require("../Controllers/Venue.controller.js");

const router = express.Router();

router.get("/", getAllVenue);

module.exports = router;
