import mongoose from "mongoose";
const { Schema } = mongoose;

const boundarySchema = new Schema({
  country_border_geometry: {
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
  province_border_geometry: {
    type: {
      type: String,
      enum: ["Polygon"], // Ensure the geometry type is always "Polygon"
      required: true,
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of coordinates for a polygon
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  county_border_geometry: {
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

const BoundaryModel = mongoose.model("County", boundarySchema);
export default BoundaryModel;
