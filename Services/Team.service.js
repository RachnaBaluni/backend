const Team = require("../models/Team.model");

exports.updateTeamRankingService = async (orderedTeams) => {
  try {
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
