import Incident from "../models/Incident.js";


// GET all incidents
export const getAllIncidents = async (req, res) => {
    try {
        const allIncidents = await Incident.find({});
        res.status(200).json(allIncidents);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
  };
  

// GET single incident by id
export const getIncidents = async (req, res) => {
    const { id } = req.params;
    try {
        const incident = await Incident.findById(id);
        if (!incident) return res.status(404).json({ error: "Incident not found" });
        res.status(200).json(incident);
    } catch (err) {
        res.status(400).json({ error: "Invalid incident ID" });
    }
  };
  

// POST
export const createNewIncident = async (req, res) => {
    const { title, description, location, category, user_id } = req.body;
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
            address: location,
            coordinates: { lat: 40.7128, lng: -74.0060 }
            };
        }
        const incident = await Incident.create({
            title,
            description,
            location: locationData,
            category,
            user_id,
            image_url,
        });
        res.status(200).json(incident);
    }catch (error) {
        console.error("INCIDENT CREATE ERROR:", error);
        res.status(400).json({ error: error.message });
    }
}
  
// DELETE
export const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findByIdAndDelete(req.params.id);
        if (!incident) return res.status(404).json({ error: "Incident not found" });
        res.status(200).json({ message: "Incident deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


  
/**
 * The backend worklow of event and incident is reference by 
 https://citixenken.hashnode.dev/uploading-image-and-additional-form-data-to-mongodb
 to handle formData submission to the mongodb database
 */
