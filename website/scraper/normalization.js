import mongoose from "mongoose";
import Event from "../server/models/Event.js";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });
const MONGO_URI = process.env.MONGO_URI;
const GEOCODING_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

mongoose.set('bufferCommands', false);
mongoose.set('autoIndex', false);

// Parse a proper formate date string
function parseStartDate(dateStr) {
    if (!dateStr) return null;

    const now = new Date();
    const year = now.getFullYear();
    const fullDateStr = `${dateStr} ${year}`;

    const parsedDate = new Date(fullDateStr);
    if (isNaN(parsedDate)) {
        console.error("Invalid date:", fullDateStr);
        return null;
    }
    console.log("Parsed date:", parsedDate.toISOString());
    return parsedDate.toISOString(); 
}

// Convert location to address and coor
async function geocodeAddress(address){
    if (!address) return null;
    try{
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GEOCODING_API_KEY}`;
    
    const res = await axios.get(url);
    if (!res.data.results.length) return null;

    const place = res.data.results[0];
    console.log("Geocoded address:", place.formatted_address, 
        "\nLat:", place.geometry.location.lat, 
        "\nLng:", place.geometry.location.lng
    );
    return {
        address: place.formatted_address,
        coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
        },
    };
    } catch(e){
        console.error("Geocoding error:", e);
        return null;
    }
}
 
function getDescription(cost, followers, link) {
    if (cost === 'Free') cost = 'Free Entry';
    let des = cost;
    if (followers) {
        des += ` | ${followers} subscribed to this event`;
    }
    des += `\nMore info: ${link}`;
    console.log("Description:", des);
    return des;
}


function getCost(cost){
    const finalCost = (cost === "Free") ? "Free" : "Paid";
    console.log("Cost:", finalCost);
    return finalCost;
}

function getCategory(title){
    // Street Fair, Concert / Live Music, Networking, Food & Drink, Job, Pet / Animal, Education, Promotions, Neighborhood, Pop-up, Sports, Other
    const lowerTitle = title.toLowerCase();
    const categories = [];
    if(lowerTitle.includes("music") || lowerTitle.includes("concert")){
        categories.push("Concert / Live Music");
    }
    if(lowerTitle.includes("tech") || lowerTitle.includes("conference") || lowerTitle.includes("networking")){
        categories.push("Networking");
    }
    if(lowerTitle.includes("food") || lowerTitle.includes("festival")){
        categories.push("Food & Drink");
    }
    if(lowerTitle.includes("job") || lowerTitle.includes("career")){
        categories.push("Job");
    }
    if(lowerTitle.includes("dog") || lowerTitle.includes("animal") || lowerTitle.includes("pet")){
        categories.push("Pet / Animal");
    }
    if(lowerTitle.includes("education") || lowerTitle.includes("student") || lowerTitle.includes("college")){
        categories.push("Education");
    }
    if(lowerTitle.includes("sports") || lowerTitle.includes("game") || lowerTitle.includes("tournament") || lowerTitle.includes("hike") || lowerTitle.includes("park")){
        categories.push("Sports");
    }
    if(lowerTitle.includes("promotion") || lowerTitle.includes("sale") || lowerTitle.includes("discount")){
        categories.push("Promotions");
    }
    if(lowerTitle.includes("neighborhood") || lowerTitle.includes("community")){
        categories.push("Neighborhood");
    }
    if(lowerTitle.includes("pop-up") || lowerTitle.includes("popup")){
        categories.push("Pop-up");
    }
    if(categories.length === 0){
        categories.push("Other");
    }
    console.log("Categories:", categories);
    return categories;
}

async function insertEvents(){
    console.log("MONGO_URI:", MONGO_URI?.substring(0, 20) + "..."); // Don't log full URI with password
    try{
        await mongoose.connect(MONGO_URI,{
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        }
        );
        console.log("Connected to MongoDB");
        const eventsCollection = mongoose.connection.collection('events');
        let dataCount = 0;
    
        const events = JSON.parse(fs.readFileSync('events.json'));
        console.log(`Found ${events.length} events to process\n`);
    
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            console.log(`Processing event: ${event.title}`);
    
            try{
                const address = event.location?.address || event.location || "";
                const geo = await geocodeAddress(address);
                const eventDoc = {
                    title: event.title,
                    description: getDescription(event.cost, event.followers, event.link),
                    start_date: parseStartDate(event.date),
                    location: geo || {
                        address,
                        coordinates: { lat: 0, lng: 0 }
                    },
                    cost: getCost(event.cost),
                    category: getCategory(event.title),
                    host: event.host || "",
                    user_id: new mongoose.Types.ObjectId('691fb67b7f064c170e1ae951'),
                    image: "",
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                const result = await eventsCollection.insertOne(eventDoc);
                console.log(`Inserted event: ${event.title}\n`);
                dataCount++;
            } catch(e){
                console.error(`Error: ${e.message}\n`);
            }
        }
        console.log(`Successfully inserted ${dataCount} events into the database.`);
    }catch(e){
        console.error("MongoDB connection error:", e);
    } finally{
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}
insertEvents();

