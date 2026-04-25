const eventService = require('../Services/Event.service');

const getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEventsService();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events.', error: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const newEvent = await eventService.createEventService(req.body);
        res.status(201).json({ success: true, data: newEvent, message: 'Event created successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating event.', error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = await eventService.updateEventService(id, req.body);
        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }
        res.status(200).json({ success: true, data: updatedEvent, message: 'Event updated successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating event.', error: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await eventService.deleteEventService(id);
        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }
        res.status(200).json({ success: true, message: 'Event deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting event.', error: error.message });
    }
};

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent };
