import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME; // Get DB name from env

if (!MONGO_URI) {
  throw new Error("❌ Please define the MONGO_URI environment variable.");
}

export const connectToDatabase = async () => {
  try {
    console.log(
      "mongoose.connection.readyState",
      mongoose.connection.readyState
    );
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB.");
      return;
    }

    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });

    console.log(`🚀 Connected to MongoDB! Database: ${MONGO_DB_NAME}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
