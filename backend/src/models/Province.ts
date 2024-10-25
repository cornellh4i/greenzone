import mongoose from "mongoose";
const { Schema } = mongoose;

// County schema to embed within Province schema
const countySchema = new Schema(
  {
    county_id: {
      type: Number,
      required: true,
    },
    county_name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Province schema
const provinceSchema = new Schema({
  province_id: {
    type: Number,
    required: true,
  },
  province_name: {
    type: String,
    required: true,
  },
  province_counties: {
    type: [countySchema], // Embed the county schema as an array
    required: true, // Make counties mandatory for each province
  },
  province_land_area: {
    type: Number,
    required: true, // Required field for province area in sq km
  },
  province_number_of_livestock: {
    type: Number,
    required: false, // Optional if not always available
  },
  province_number_of_herders: {
    type: Number,
    required: false, // Optional field
  },
  province_livestock_mortality_rate: {
    type: Number,
    required: false, // Optional field for livestock mortality rate
  },
  province_population: {
    type: Number,
    required: false, // Optional population field
  },
});

const ProvinceModel = mongoose.model("Province", provinceSchema);
export default ProvinceModel;
