const mongoose = require("mongoose");

require("dotenv").config({ path: "config.env" });
const MONGO_URI = process.env.MONGO_URI;

module.exports = {
  connectToServer: function () {
    mongoose
      .connect(MONGO_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error: any) => console.error("MongoDB connection error:", error));
  },
};
