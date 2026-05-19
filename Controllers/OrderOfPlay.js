const OrderOfPlay = require("../models/OrderOfPlay");

// ✅ SAVE / UPDATE ORDER OF PLAY
const saveOrderOfPlay = async (req, res) => {
  try {
    const { eventId, grid } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required"
      });
    }

    const saved = await OrderOfPlay.findOneAndUpdate(
      { eventId },
      { eventId, grid },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: saved
    });

  } catch (err) {
    console.log("OrderOfPlay Save Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ GET ORDER OF PLAY (optional but useful)
const getOrderOfPlay = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await OrderOfPlay.findOne({ eventId });

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.log("OrderOfPlay Get Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  saveOrderOfPlay,
  getOrderOfPlay
};