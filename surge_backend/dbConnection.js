import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://manmeet:manmeet2341@cluster0.biaks.mongodb.net/sales";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Listen for connection events
        mongoose.connection.on("error", (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        // Graceful process termination
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        });
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
