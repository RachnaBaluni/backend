const express = require("express");

const controller = require("../Controllers/Team.controller");

console.log("Controller:", controller);

const { isAdmin } = require("../MiddleWare/authMiddleware");

const router = express.Router();

router.get("/all", controller.getAllTeams);
router.get("/unassigned", controller.getUnassignedTeams);
router.get("/:id", controller.getPlayerTeams);
router.put("/update-ranking", isAdmin, controller.updateTeamRanking);

module.exports = router;
