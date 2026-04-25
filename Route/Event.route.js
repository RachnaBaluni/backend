const express = require("express");
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../Controllers/Events.controller.js");
const { isAdmin } = require("../MiddleWare/authMiddleware");

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", isAdmin, createEvent);
router.put("/:id", isAdmin, updateEvent);
router.delete("/:id", isAdmin, deleteEvent);

module.exports = router;
