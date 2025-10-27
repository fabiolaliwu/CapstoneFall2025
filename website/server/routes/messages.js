import express from "express";
import { getMessages, createMessage } from "../controllers/messageControllers.js";

const router = express.Router();

// GET
router.get("/", getMessages);

// POST a new message
router.post("/", createMessage);

export default router;
