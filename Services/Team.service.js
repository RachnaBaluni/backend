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

    const teamsWithDrawStatus = await Promise.all(
      teams.map(async (team) => {
        const drawExists = await Nissan_Draws.findOne({
          Event: team.eventId._id,
        });

        return {
          ...team.toObject(),
          drawCreated: !!drawExists,
        };
      }),
    );

    return teamsWithDrawStatus;
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
exports.getUnassignedTeamsService = async (eventId) => {
  try {
    // Event ki saari registered teams
    const teams = await Team.find({ eventId })
      .populate({ path: "partner1", select: "name" })
      .populate({ path: "partner2", select: "name" });

    // Draw me already use hui teams
    const draws = await Nissan_Draws.find({ Event: eventId });

    const usedTeamIds = new Set();

    draws.forEach((draw) => {
      if (draw.Team1) usedTeamIds.add(draw.Team1.toString());
      if (draw.Team2) usedTeamIds.add(draw.Team2.toString());
    });

    // Sirf additional teams
    const availableTeams = teams.filter(
      (team) => !usedTeamIds.has(team._id.toString()),
    );

    return availableTeams;
  } catch (error) {
    throw new Error(error.message);
  }
};
