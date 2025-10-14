import Event from "../models/Event.js";


// GET all event
export const getAllEvents = async (req, res) => {
    try {
        const allEvents = await Event.find({});
        res.status(200).json(allEvents);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
  };

// GET single event by id
export const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ error: "Invalid event ID" });
    }
  };
  

// POST
export const createNewEvent = async (req, res) => {
    const { title, description, start_date, end_date, cost, location, category, host, user_id } = req.body;
    let image_url = "";
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }
    if (user_id === '0' || !user_id) {
        return res.status(401).json({ error: "Unauthorized: User ID is required" });
    }
    try {
        let locationData;
        try {
            locationData = typeof location === 'string' ? JSON.parse(location) : location;
        } catch (parseError) {
            // If parsing fails, use the string as address with default coordinates
            locationData = {
            address: location || "Unknown location",
            coordinates: { lat: 40.7128, lng: -74.0060 }
            };
        }
        const event = await Event.create({
            title,
            description,
            start_date,
            end_date,
            cost,
            location: locationData,
            category,
            host,
            user_id,
            image_url,
        });
        res.status(200).json(event);
    } catch (error) {
        console.error("EVENT CREATE ERROR:", error);
        res.status(400).json({ error: error.message });
    }
}

// DELETE
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  };
  