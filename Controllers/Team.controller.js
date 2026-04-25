const {
  updateTeamRankingService,
  getAllTeamsService,
  getPlayerTeamsService,
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
      message: "Error updating team rankings.",
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
