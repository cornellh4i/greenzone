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
  province_number_of_livestock: {
    type: Number,
    required: true,
  },
  province_number_of_cattle: {
    type: Number,
    required: true,
  },
  province_number_of_goat: {
    type: Number,
    required: true,
  },
  province_number_of_sheep: {
    type: Number,
    required: true,
  },
  province_number_of_camel: {
    type: Number,
    required: true,
  },
});

const ProvinceModel = mongoose.model("Province", provinceSchema);
export default ProvinceModel;
