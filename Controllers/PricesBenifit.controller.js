const pricesBenifitService = require('../Services/PricesBenifit.service');

const getAllPricesBenifit = async (req, res) => {
    try {
        const events = await pricesBenifitService.getAllPricesBenifitService();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events.', error: error.message });
    }
};

module.exports = { getAllPricesBenifit};
