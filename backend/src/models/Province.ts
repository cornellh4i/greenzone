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
    type: Map,
    of: Number,
    required: true,
  },
  province_number_of_cattle: {
    type: Map,
    of: Number,
    required: true,
  },
  province_number_of_goat: {
    type: Map,
    of: Number,
    required: true,
  },
  province_number_of_sheep: {
    type: Map,
    of: Number,
    required: true,
  },
  province_number_of_camel: {
    type: Map,
    of: Number,
    required: true,
  },
  province_number_of_horse: {
    type: Map,
    of: Number,
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
