import mongoose from "mongoose";

mongoose.set("debug", true);
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

if (!MONGO_URI) {
  throw new Error("❌ Please define the MONGO_URI environment variable.");
}

export const connectToDatabase = async () => {
  try {
    console.log("🔄 Checking MongoDB connection status...");

    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB.");
      return;
    }

    if (mongoose.connections[0].readyState !== 1) {
      console.log(
        "🔌 No active connection found. Attempting to connect to MongoDB..."
      );

      await mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME });

      console.log(
        `🚀 Successfully connected to MongoDB! Database: ${MONGO_DB_NAME}`
      );
    } else {
      console.log("✅ Already connected to MongoDB.");
    }
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
