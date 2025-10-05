import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import incidentRoutes from "./routes/incidents.js";
import eventRoutes from "./routes/events.js";
import contactRoutes from "./routes/contacts.js";

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
app.use("/api/Incidents", incidentRoutes);
app.use("/api/Events", eventRoutes);
app.use("/api/Contacts", contactRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// citation:https://javascript.plainenglish.io/how-i-integrated-a-mongodb-database-into-my-react-js-project-6cdc331923d3