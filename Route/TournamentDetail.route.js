const express = require("express");
const {
  getAllTournamentDetails
} = require("../Controllers/TournamentDetail.controller.js");

const router = express.Router();

router.get("/", getAllTournamentDetails);

module.exports = router;
