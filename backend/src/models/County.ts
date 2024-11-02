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
  county_name: {
    type: String,
    required: true,
  },
  county_land_area: {
    type: Number,
    required: true,
  },
  county_number_of_livestock: {
    type: Number,
    required: true,
  },
});

const CountyModel = mongoose.model("County", countySchema);
export default CountyModel;
