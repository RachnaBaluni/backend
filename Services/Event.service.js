const Event = require('../models/Event.model');

exports.getAllEventsService = async () => {
    try {
        return await Event.find().sort({ date: 'desc' });
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createEventService = async (eventData) => {
    try {
        const newEvent = new Event(eventData);
        return await newEvent.save();
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.updateEventService = async (eventId, eventData) => {
    try {
        return await Event.findByIdAndUpdate(eventId, eventData, { new: true });
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.deleteEventService = async (eventId) => {
    try {
        return await Event.findByIdAndDelete(eventId);
    } catch (error) {
        throw new Error(error.message);
    }
};
