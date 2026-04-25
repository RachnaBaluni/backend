const tournamentDetailService = require('../Services/TournamentDetail.service');

const getAllTournamentDetails = async (req, res) => {
    try {
        const events = await tournamentDetailService.getAllTournamentDetailService();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events.', error: error.message });
    }
};

module.exports = { getAllTournamentDetails};
