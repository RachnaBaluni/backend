const OrderOfPlay = require("../models/OrderOfPlay.model.js");

// ---------------- SAVE ----------------
const saveOrderOfPlay = async (req, res) => {
  try {
    const eventId = req.body?.eventId;
    const playDate = req.body?.playDate;
    const grid = req.body?.grid;
    console.log("SAVE REQUEST", {
      eventId,
      playDate,
      gridRows: grid?.length,
    });

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId missing",
      });
    }

    const saved = await OrderOfPlay.findOneAndUpdate(
      {
        eventId,
        playDate,
      },
      {
        eventId,
        playDate,
        grid,
      },
      {
        upsert: true,
        new: true,
      },
    );
    console.log("SAVED =>", saved);

    return res.json({
      success: true,
      data: saved,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ---------------- GET ----------------
const getOrderOfPlay = async (req, res) => {
  try {
    console.log("PARAMS =>", req.params);

    const data = await OrderOfPlay.find({
      eventId: req.params.eventId,
    }).sort({ playDate: 1 });
    console.log("FOUND =>", data);

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.log("ERROR =>", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  saveOrderOfPlay,
  getOrderOfPlay,
};
