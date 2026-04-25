const express = require("express");
const {
  getAllPricesBenifit
} = require("../Controllers/PricesBenifit.controller.js");

const router = express.Router();

router.get("/", getAllPricesBenifit);

module.exports = router;
