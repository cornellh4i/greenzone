import mongoose from "mongoose";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
require("dotenv").config({ path: "config.env" });

const MONGO_URI = process.env.MONGO_URI;
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
let supabase: SupabaseClient | null = null;

// const connectToServer = (callback: (err?: Error) => void) => {
//   mongoose
//     .connect(MONGO_URI!)
//     .then(() => {
//       console.log("Connected to MongoDB");
//       callback();
//     })
//     .catch((error) => {
//       console.error("MongoDB connection error:", error);
//       callback(error);
//     });
// };

const connectToServer = () => {
  if (!supabaseUrl && !supabaseKey) {
    console.log("Supabase URL and Key are NUll");
    return null;
  }
  try {
    const client = createClient(supabaseUrl, supabaseKey);
    console.log("PostGreSql ");
    if (client) {
      // makes sure supabase is not null
      supabase = client;
    }
  } catch (error) {
    console.log("Error creating supabase client");
  }
};

export { supabase, connectToServer };
