import mongoose from "mongoose";
const { Schema } = mongoose;

const provinceSchema = new Schema({
  aid: {
    type: Number,
    required: true,
  },
  province_name: {
    type: String,
    required: true,
  },
  province_counties: {
    type: [Number],
    required: true,
  },
  province_land_area: {
    type: Number,
    required: true,
  },
  province_herders: {
    type: Number,
    required: true,
  },
  province_number_of_livestock: {
    type: { String: String },
    required: true,
  },
  province_number_of_cattle: {
    type: { Number: Number },
    required: true,
  },
  province_number_of_goat: {
    type: { Number: Number },
    required: true,
  },
  province_number_of_sheep: {
    type: { Number: Number },
    required: true,
  },
  province_number_of_camel: {
    type: { Number: Number },
    required: true,
  },
  province_number_of_horse: {
    type: { Number: Number },
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

const ProvinceModel = mongoose.model("Province", provinceSchema);
export default ProvinceModel;
