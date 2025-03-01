import { getInviterProfile, inviteUser, loginUser, registerUser } from "./controllers/User";
import { getDestinations, createDestination } from "./controllers/Destinations";
import connectDB from "./config/MongoConfig";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
connectDB();

export const app = express();
app.use(express.json(), cors());

const PORT = process.env.PORT || 5000;

app.get("/api/destinations", getDestinations);
app.post("/api/destinations", createDestination);
app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.get("/api/profile", getInviterProfile);
app.post("/api/invite", inviteUser);

app.get("/", (req, res) => {
  res.send("Endpoints are active.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
