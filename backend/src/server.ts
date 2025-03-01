import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getDestinations, createDestination } from "./controllers/Destinations";
import connectDB from "./config/MongoConfig";

dotenv.config();
connectDB();

const app = express();
app.use(express.json(), cors());

const PORT = process.env.PORT || 5000;

app.get("/api/destinations", getDestinations);
app.post("/api/destinations", createDestination);

app.get("/", (req, res) => {
  res.send("Endpoints are active.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});