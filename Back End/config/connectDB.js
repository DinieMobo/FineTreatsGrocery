import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

if (!process.env.MONGODB_URI){
    throw new Error(
        "Please provide a MONGODB_URI in the .env file"
    )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB database");
    } catch (error) {
        console.error("Error connecting to MongoDB database",error)
        process.exit(1);
    }
}

export default connectDB;