const MainEvent = require("../models/MainEvent.model.js");

const getMainEvents = async (req, res) => {
  try {
    const events = await MainEvent.find();
    res.status(200).json({
      success: true,
      message: "Fetched Main Events Successfully",
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const addMainEvent = async (req, res) => {
  try {
    const { name, description, date, location, organizer, rules } = req.body;
    if (!name || !date || !description || !location || !organizer)
      throw new Error("All Details are Required");

    if (new Date(date) < new Date()) {
      throw new Error("Date is not correct.");
    }

    const event = await MainEvent.create({
      name,
      description,
      date,
      location,
      organizer,
      rules,
    });

    res.status(200).json({
      success: true,
      message: "The Main Event has been Added",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMainEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, location, organizer, rules } = req.body;
    const event = await MainEvent.findByIdAndUpdate(
      id,
      { name, description, date, location, organizer, rules },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Main Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Main Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMainEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await MainEvent.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Main Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Main Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMainEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await MainEvent.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Main Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Main Event Successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMainEvents,
  addMainEvent,
  updateMainEvent,
  deleteMainEvent,
  getMainEventById,
};
