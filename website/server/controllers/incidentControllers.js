import Incident from "../models/Incident.js";
import uploadImage from "../imageUpload.js";

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
    const { title, description, location, category, user_id, image } = req.body;
    let train_line = [];
    if (req.body.train_line){
        try {
            // parse train_line
            train_line = typeof req.body.train_line === "string"
                ? JSON.parse(req.body.train_line)
                : req.body.train_line;
        } catch (err) {
            console.warn("TRAIN LINE PARSE ERROR:", err);
        }
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
        let imageURL = "";
        if(image) {
            try{
                const uploadResult = await uploadImage(image, `event-${title.replace(/\s+/g, '-')}`);
                imageURL = uploadResult.url;
                console.log("Image uploaded to S3:", imageURL);    
            } catch{
                console.error("Image upload failed, saving incident without image.");
            }
        }
        const incident = await Incident.create({
            title,
            description,
            location: locationData,
            category,
            train_line,
            user_id,
            image: imageURL
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

// Incidents by User
export const getIncidentsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const userIncidents = await Incident.find({ user_id: userId });
        res.status(200).json(userIncidents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update Incident
export const updateIncident = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.train_line) {
        try {
            updateData.train_line = typeof updateData.train_line === "string"
                ? JSON.parse(updateData.train_line)
                : updateData.train_line;
        } catch (err) {
            console.warn("TRAIN LINE PARSE ERROR:", err);
        }
    }

    try {
        const updatedIncident = await Incident.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedIncident) return res.status(404).json({ error: "Incident not found" });
        res.status(200).json(updatedIncident);
    } catch (err) {
        res.status(400).json({ error: "Invalid incident ID" });
    }
};


  
/**
 * The backend worklow of event and incident is reference by 
 https://citixenken.hashnode.dev/uploading-image-and-additional-form-data-to-mongodb
 to handle formData submission to the mongodb database
 */
