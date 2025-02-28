import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  clues: { type: [String], required: true },
  funFact: { type: [String], required: true },
  trivia: { type: [String], required: true }
});

export default mongoose.model("destinations", DestinationSchema);