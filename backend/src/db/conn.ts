import mongoose from "mongoose";

require("dotenv").config({ path: "config.env" });

const MONGO_URI = process.env.MONGO_URI;

const connectToServer = (callback: (err?: Error) => void) => {
  mongoose.connect(MONGO_URI!)
      .then(() => {
          console.log("Connected to MongoDB");
          callback();
      })
      .catch((error) => {
          console.error("MongoDB connection error:", error);
          callback(error);
      });
};

export default connectToServer;
