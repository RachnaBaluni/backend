const PricesBenifit = require('../models/PricesBenifit.model');

exports.getAllPricesBenifitService = async () => {
    try {
        return await PricesBenifit.find();
    } catch (error) {
        throw new Error(error.message);
    }
};
