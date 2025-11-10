import express from "express";
import Event from "../models/Event.js";
import {
    getAllEvents,
    getEventById,
    createNewEvent,
    deleteEvent,
    getEventsByUser
}from "../controllers/eventControllers.js";

const router = express.Router();

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
router.post("/", createNewEvent);

// DELETE
router.delete("/:id", deleteEvent);

// GET events by user
router.get("/user/:userId", getEventsByUser);

export default router;


/* Citation: referenced how to connect search bar to backend from: 
https://medium.com/@aniagudo.godson/running-a-simple-search-query-on-mongodb-atlas-using-express-nodejs-1-making-basic-queries-a426e2bd9478 
*/