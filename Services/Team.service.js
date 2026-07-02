const Team = require("../models/Team.model");
const Nissan_Draws = require("../models/Nissan_Draws.model");
exports.updateTeamRankingService = async (orderedTeams) => {
  try {
    // Get first team to identify the event
    const firstTeam = await Team.findById(orderedTeams[0]);

    // Check if draw already exists for this event
    const drawExists = await Nissan_Draws.findOne({
      Event: firstTeam.eventId,
    });

    if (drawExists) {
      throw new Error(
        "Draw has already been created for this category. Ranking cannot be updated.",
      );
    }
    const promises = orderedTeams.map((teamId, index) => {
      return Team.findByIdAndUpdate(teamId, { rank: index + 1 });
    });
    await Promise.all(promises);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllTeamsService = async (eventId = null) => {
  try {
    let query = {};
    if (eventId) {
      query.eventId = eventId;
    }
    const teams = await Team.find(query)
      .populate({ path: "partner1", select: "name" })
      .populate({ path: "partner2", select: "name" })
      .populate({ path: "eventId", select: "name" })
      .sort({ rank: "asc" });
    return teams;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getPlayerTeamsService = async (id) => {
  try {
    const teams = await Team.find({
      $or: [{ partner1: id }, { partner2: id }],
    })
      .populate({ path: "partner1", select: "name" })
      .populate({ path: "partner2", select: "name" })
      .populate({ path: "eventId", select: "name" });
    return teams;
  } catch (error) {
    throw new Error(error.message);
  }
};
