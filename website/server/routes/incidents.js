import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    getAllIncidents,
    getIncidents,
    createNewIncident,
    deleteIncident,
  } from "../controllers/incidentControllers.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// hanldle image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
      },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
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

export default router;
