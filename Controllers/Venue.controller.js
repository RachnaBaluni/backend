const venueService = require('../Services/Venue.service');

const getAllVenue = async (req, res) => {
    try {
        const events = await venueService.getAllVenueService();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events.', error: error.message });
    }
};

module.exports = { getAllVenue};
