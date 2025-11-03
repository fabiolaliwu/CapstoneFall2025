import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Event from "../models/Event.js";
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

// Search events by keyword
router.get("/search", async (req, res) => {
    const { keyword } = req.query;
    try {
        const regex = new RegExp(keyword, "i");
        const events = await Event.find({
            $or: [{ title: regex }, { description: regex }, { "location.address": regex }],
        });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all events:
router.get("/", getAllEvents);

// GET a single event by id:
router.get("/:id", getEventById);

// POST new event with image
router.post("/", upload.single("image"), createNewEvent);

// DELETE
router.delete("/:id", deleteEvent);

export default router;