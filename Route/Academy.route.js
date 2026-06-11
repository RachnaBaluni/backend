const express = require("express");
const router = express.Router();
const Academy = require("../models/Academy");

// Get all verified academies
router.get("/", async (req, res) => {
  try {
    const academies = await Academy.find();
    console.log("Academies count:", academies.length);

    res.status(200).json({
      success: true,
      academies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
