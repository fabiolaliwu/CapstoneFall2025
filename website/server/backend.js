import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import incidentRoutes from "./routes/incidents.js";
import eventRoutes from "./routes/events.js";
import contactRoutes from "./routes/contacts.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/incidents", incidentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);

// wait for database connection before starting server --> needed for authentication
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}; // ai debugging here

startServer();
