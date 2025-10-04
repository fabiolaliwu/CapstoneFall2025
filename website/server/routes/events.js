import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    getAllEvents,
    getEventById,
    createNewEvent,
    deleteEvent,
}from "../controllers/eventControllers.js";

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
    // image file name format
    filename: (req, file, callback) => {
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname); 
        const newFileName = `${timestamp}${fileExtension}`;
  
      callback(null, newFileName);
    },
});

const upload = multer({ storage });

// GET all events:
router.get("/", getAllEvents);

// GET a single event by id:
router.get("/:id", getEventById);

// POST new event with image
router.post("/", upload.single("image"), createNewEvent);

// DELETE
router.delete("/:id", deleteEvent);

export default router;