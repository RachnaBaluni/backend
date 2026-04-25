const Venue = require('../models/Venue.model');

exports.getAllVenueService = async () => {
    try {
        return await Venue.find();
    } catch (error) {
        throw new Error(error.message);
    }
};
