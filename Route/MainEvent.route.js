const express = require("express");
const MainEventController = require("../Controllers/MainEvent.controller.js");
const { isAdmin } = require("../MiddleWare/authMiddleware.js");

const router = express.Router();

router.get("/", MainEventController.getMainEvents);
router.get("/:id", MainEventController.getMainEventById);

router.post("/add", isAdmin, MainEventController.addMainEvent);

router.put("/update/:id", isAdmin, MainEventController.updateMainEvent);
router.delete("/delete/:id", isAdmin, MainEventController.deleteMainEvent);

module.exports = router;
