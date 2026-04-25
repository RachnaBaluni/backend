const TournamentDetail = require('../models/TournamentDetail.model');

exports.getAllTournamentDetailService = async () => {
    try {
        return await TournamentDetail.find();
    } catch (error) {
        throw new Error(error.message);
    }
};
