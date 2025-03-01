import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, favourite } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new UserModel({ name, email, password: hashedPassword, favourite }).save();

    const token = jwt.sign({ name, email, favourite, id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ name: user.name, email: user.email, favourite: user.favourite, id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    res.json({ message: "Login successful", token });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const inviterId = req.body.inviterId as string;

    const inviter = await UserModel.findById(inviterId);
    if (!inviter) {
      res.status(404).json({ message: "Inviter not found" });
    } else {
      const inviteToken = jwt.sign({ inviterId, inviterName: inviter.name, inviterScore: inviter.highestScore }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
      const inviteLink = `${process.env.FRONTEND_URL}/invite?token=${inviteToken}`;
      res.json({ message: "Invite generated", inviteLink });
    }
  } catch (error) {
    console.error("Error generating invite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};