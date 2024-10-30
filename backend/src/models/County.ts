import mongoose from "mongoose";
const { Schema } = mongoose;

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

const CountyModel = mongoose.model("County", countySchema);
export default CountyModel;
