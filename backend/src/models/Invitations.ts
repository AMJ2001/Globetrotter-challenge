import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
  inviteCode: { type: String, required: true, unique: true },
  inviterId: { type: String, required: true },
  inviterName: { type: String, required: true },
  inviterScore: { type: Number, required: false },
  imageUrl: { type: String, required: false }
});

export const InviteModel = mongoose.model("invitations", InvitationSchema);