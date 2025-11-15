import express from "express";
import Incident from "../models/Incident.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    getIncidents,
    createNewIncident,
    deleteIncident,
    getIncidentsByUser,
    updateIncident
  } from "../controllers/incidentControllers.js";

const router = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);

// Multer setup
const storage = multer.diskStorage({
    // image destination
    destination: (req, file, callback) => {
      const uploadFolder = path.join(currentDir, "../uploads");
      callback(null, uploadFolder);
    },
    filename: (req, file, callback) => {
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname); 
        const newFileName = `${timestamp}${fileExtension}`; // image filename format
  
      callback(null, newFileName);
    },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
      const { search, category, dateRange } = req.query;

      let queryFilter = {};

      // Search by Keyword
      if (search) {
          const regex = new RegExp(search, "i"); 
          queryFilter.$or = [
              { title: regex }, 
              { description: regex }, 
              { "location.address": regex }
          ];
      }

      // Search incident by Category
      if (category && category !== 'All') {
          queryFilter.category = { $in: [category] };
      }
      
      // Search by Date Range
      if (dateRange && dateRange !== 'Any') {
          if (dateRange === 'Today') {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              queryFilter.createdAt = { $gte: today, $lt: tomorrow };
          } else if (dateRange === 'Last 7 Days') {
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              queryFilter.createdAt = { $gte: sevenDaysAgo };
          } else if (dateRange === 'Last Month') {
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
              queryFilter.createdAt = { $gte: oneMonthAgo };
          }
      }

      const incidents = await Incident.find(queryFilter);
      res.status(200).json(incidents);

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// GET a single incident by id:
router.get("/:id", getIncidents);

// POST new incident with image
router.post("/", createNewIncident);

// DELETE
router.delete("/:id", deleteIncident);

// GET incidents by user
router.get("/user/:userId", getIncidentsByUser);

// PUT update incident
router.put("/:id", updateIncident);

export default router;
