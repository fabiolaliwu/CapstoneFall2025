import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    getAllIncidents,
    getIncidents,
    createNewIncident,
    deleteIncident,
    getIncidentsByUser
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

// GET all incidents:
router.get("/", getAllIncidents);

// GET a single incident by id:
router.get("/:id", getIncidents);

// POST new incident with image
router.post("/", upload.single("image"), createNewIncident);

// DELETE
router.delete("/:id", deleteIncident);

// GET incidents by user
router.get("/user/:userId", getIncidentsByUser);

export default router;
