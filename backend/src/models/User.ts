import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  favourite: { type: String, required: false },
  highestScore: { type: String, required: false }
});

export const UserModel = mongoose.model("users", UserSchema);