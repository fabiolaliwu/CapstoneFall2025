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
                queryFilter.start_date = { $gte: today, $lt: tomorrow };
            } else if (dateRange === 'Last 7 Days') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                queryFilter.start_date = { $gte: sevenDaysAgo };
            } else if (dateRange === 'Last Month') {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                queryFilter.start_date = { $gte: oneMonthAgo };
            }
        }

        const events = await Event.find(queryFilter);
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