import mongoose from "mongoose";
import logger from "./logger.js";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.error("MONGO_URI missing");
    throw new Error("MONGO_URI missing");
  }
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
