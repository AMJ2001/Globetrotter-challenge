import request from "supertest";
import { app } from "../server";
import { UserModel } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

jest.mock("../models/User");

describe("User Controller", () => {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    password: "hashedPassword",
    favourite: "Paris",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Register: Should create a new user and return a token", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      favourite: "Paris",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(UserModel.create).toHaveBeenCalled();
  });

  test("Login: Should authenticate user and return a token", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      ...mockUser,
      password: await bcrypt.hash("password123", 10),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Invite User: Should return an invite link", async () => {
    const res = await request(app).post("/api/users/invite").send({
      email: "test@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("inviteLink");
  });
});