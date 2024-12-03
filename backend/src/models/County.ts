import mongoose from "mongoose";
const { Schema } = mongoose;

const countySchema = new Schema({
  sid: {
    type: Number,
    required: true,
  },
  aid: {
    type: Number,
    required: true,
  },
  asid: {
    type: Number,
    required: true,
  },
  soum_name: {
    type: String,
    required: true,
  },
  province_name: {
    type: String,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Polygon"], // Ensure the geometry type is always "Polygon"
      required: true,
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of coordinates for a polygon
      required: true,
    },
  },
});

const CountyModel = mongoose.model("County", countySchema);
export default CountyModel;
