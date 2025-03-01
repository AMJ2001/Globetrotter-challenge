import request from "supertest";
import { app } from "../server";
import { DestinationModel } from "../models/Destinations";

jest.mock("../models/Destinations");

describe("Destinations Controller", () => {
  const mockDestinations = [
    { name: "Paris", country: "France" },
    { name: "Tokyo", country: "Japan" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Get Destinations: Should return all destinations", async () => {
    (DestinationModel.find as jest.Mock).mockResolvedValue(mockDestinations);

    const res = await request(app).get("/api/destinations");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockDestinations);
  });

  test("Create Destinations: Should add new destinations", async () => {
    (DestinationModel.insertMany as jest.Mock).mockResolvedValue(mockDestinations);

    const res = await request(app).post("/api/destinations").send(mockDestinations);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Destinations added successfully");
  });
});