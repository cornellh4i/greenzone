import express from "express";
import { createHexagon, getHexagons } from "./controller/Hexagon";
import {
  createProvince,
  deleteProvince,
  getProvinces,
  updateProvince,
} from "./controller/Province";
import { createCounty, getCounties } from "./controller/County";

const router = express.Router();

// Route to create a new hexagon
router.post("/hexagons", createHexagon);

// Route to get all hexagons
router.get("/hexagons", getHexagons);

// Route to create a new province
router.post("/province", createProvince);

// Route to get all provinces
router.get("/province", getProvinces);

// Route to update a province
router.put("/province/:province_id", updateProvince);

// Route to delete a province
router.delete("/province/:province_id", deleteProvince);

// Route to create a new county
router.post("/counties", createCounty);

// Route to get all counties
router.get("/counties", getCounties);

export default router;
