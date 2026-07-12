const {
  updateTeamRankingService,
  getAllTeamsService,
  getPlayerTeamsService,
  getUnassignedTeamsService,
} = require("../Services/Team.service");

exports.updateTeamRanking = async (req, res) => {
  try {
    const { orderedTeams } = req.body;
    await updateTeamRankingService(orderedTeams);
    res
      .status(200)
      .json({ success: true, message: "Team rankings updated successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Draw has already been created for this category. Ranking cannot be updated.",
      error: error.message,
    });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const { eventId } = req.query; // Get eventId from query parameters
    const teams = await getAllTeamsService(eventId);
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teams.",
      error: error.message,
    });
  }
};

exports.getPlayerTeams = async (req, res) => {
  try {
    const teams = await getPlayerTeamsService(req.params.id);
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Player Teamsteams.",
      error: error.message,
    });
  }
};
exports.getUnassignedTeams = async (req, res) => {
  try {
    const { eventId } = req.query;

    const teams = await getUnassignedTeamsService(eventId);

    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
console.log({
  updateTeamRanking: typeof exports.updateTeamRanking,
  getAllTeams: typeof exports.getAllTeams,
  getPlayerTeams: typeof exports.getPlayerTeams,
  getUnassignedTeams: typeof exports.getUnassignedTeams,
});
