import { createClient } from "@supabase/supabase-js";
import ProvinceModel from "../src/models/Province";
import CountyModel from "./models/County";
import HexagonModel from "./models/Hexagon";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
import connectToServer from "./db/conn";

dotenv.config({ path: "./config.env" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
if (!supabaseUrl) throw new Error("supabaseUrl is required.");

const supabase = createClient(supabaseUrl, supabaseKey!);

const getProvinces = async () => {
  try {
    await connectToServer(() => console.log("Extracting province data..."));
    const provinces = await CountyModel.find();
    return provinces;
  } catch (error: any) {
    console.error("Error fetching province data:", error);
    return [];
  }
};

// insert
(async () => {
  const provinces = await getProvinces();
  const size = provinces.length;
  var i: number = 0;
  for (i; i < size; i++) {
    const province = provinces[i];
    const countyID = province.asid;
    const provinceID = province.aid;
    const provinceGeo = province.geometry;
    const prov_json = province.toObject();
    const province_json = Object.fromEntries(
      Object.entries(prov_json).filter(
        ([key]) =>
          key !== "_id" &&
          key !== "__v" &&
          key !== "aid" &&
          key !== "geometry" &&
          key !== "asid"
      )
    );
    const { error } = await supabase.from("Counties").insert([
      {
        county_id: countyID,
        province_id: provinceID,
        county_data: province_json,
        county_geometry: provinceGeo,
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log(`Data was inserted successfully.`);
    }
  }
})();
