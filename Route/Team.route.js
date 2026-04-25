const express = require("express");
const {
  updateTeamRanking,
  getAllTeams,
  getPlayerTeams,
} = require("../Controllers/Team.controller");
const { isAdmin } = require("../MiddleWare/authMiddleware");

const router = express.Router();

router.get("/all", getAllTeams);
router.get("/:id", getPlayerTeams);
router.put("/update-ranking", isAdmin, updateTeamRanking);

module.exports = router;
