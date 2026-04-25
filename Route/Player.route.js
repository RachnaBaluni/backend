const express = require("express");
const PlayerController = require("../Controllers/Player.controller.js");
const { isAdmin } = require("../MiddleWare/authMiddleware.js");

const router = express.Router();

router.get("/", PlayerController.getPlayers);
router.get("/details", isAdmin, PlayerController.getPlayersWithDetails);
router.get("/details-frontend", PlayerController.getPlayersWithDetailsFrontend);
router.post("/register/", PlayerController.RegisterPlayer);
router.post("/login", PlayerController.loginPlayer);
router.get("/:id", PlayerController.getLoggedInPlayer);
router.post("/:id/updatePlayer", PlayerController.updatePlayer);
router.post("/:id/updateTeams", PlayerController.updateTeams);
router.put("/toggle-fee/:id", isAdmin, PlayerController.toggleFeeStatus);
router.delete("/:id", isAdmin, PlayerController.deletePlayer);
router.get("/journey/:playerId", isAdmin, PlayerController.getPlayerJourney);

module.exports = router;
