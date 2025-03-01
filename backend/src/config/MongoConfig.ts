import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/globetrotter";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI || MONGO_URI);

    console.log("MongoDB Connected.");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;