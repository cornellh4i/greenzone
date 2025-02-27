import mongoose from "mongoose";
const { Schema } = mongoose;

const hexagonSchema = new Schema({
  grid_id: {
    type: Number,
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
  grid_area: {
    type: Number,
    required: true,
  },
  aid: {
    type: Number,
    required: true,
  },
  sid: {
    type: Number,
    required: true,
  },
  asid: {
    type: Number,
    required: true,
  },
  soum_utm_crs: {
    type: Number,
    required: true,
  },
  attribute_1: {
    type: Number,
    required: false, // Optional, specify required: true if it's mandatory
  },
  area_km2: {
    type: Number,
    required: false,
  },
  livestock: {
    type: Number,
    required: false,
  },
  herders: {
    type: Number,
    required: false,
  },
});

const HexagonModel = (module.exports = mongoose.model(
  "Hexagon",
  hexagonSchema
));
export default HexagonModel;
