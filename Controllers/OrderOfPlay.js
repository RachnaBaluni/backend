const OrderOfPlay = require("../models/OrderOfPlay");

// ✅ SAVE / UPDATE ORDER OF PLAY
const saveOrderOfPlay = async (req, res) => {
  try {
    console.log("BODY:", req.body); // debug

    const { eventId, grid } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required"
      });
    }

    if (!grid) {
      return res.status(400).json({
        success: false,
        message: "grid is required"
      });
    }

    const saved = await OrderOfPlay.findOneAndUpdate(
      { eventId },
      { eventId, grid },
      {
        upsert: true,
        new: true
      }
    );

    return res.status(200).json({
      success: true,
      data: saved
    });

  } catch (err) {
    console.log("ORDER OF PLAY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ GET ORDER OF PLAY
const getOrderOfPlay = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await OrderOfPlay.findOne({ eventId });

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.log("GET ORDER OF PLAY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  saveOrderOfPlay,
  getOrderOfPlay
};