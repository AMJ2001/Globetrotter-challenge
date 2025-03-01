import { Request, Response } from "express";
import { DestinationModel } from "../models/Destinations";

export const getDestinations = async (req: Request, res: Response) => {
  try {
    const destinations = await DestinationModel.find({}, { _id: 0 });
    res.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const destinations = req.body;
    const insertedDestinations = await DestinationModel.insertMany(destinations, { ordered: false });
    res.status(201).json({ message: "Destinations added successfully", data: insertedDestinations });
  } catch (error: any) {
    res.status(500).json({ message: "Error adding locations", error: error.message });
  }
};