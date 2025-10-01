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

// hanldle image uploads, image stores in /uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
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