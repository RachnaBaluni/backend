const express = require("express");
const {
  saveOrderOfPlay,
  getOrderOfPlay
} = require("../Controllers/OrderOfPlay");

const router = express.Router();

router.post("/order-of-play", saveOrderOfPlay);

router.get("/order-of-play/:eventId", getOrderOfPlay);

module.exports = router;