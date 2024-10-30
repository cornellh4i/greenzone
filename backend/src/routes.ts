import express from "express";
import { createHexagon, getHexagons } from "./controller/Hexagon";
import { createProvince, getProvinces } from "./controller/Province";
import { createCounty, getCounties } from "./controller/County";

const router = express.Router();

// Route to create a new hexagon
router.post("/hexagons", createHexagon);

// Route to get all hexagons
router.get("/hexagons", getHexagons);

// Route to create a new province
router.post("/provinces", createProvince);

// Route to get all provinces
router.get("/provinces", getProvinces);

// Route to create a new county
router.post("/counties", createCounty);

// Route to get all counties
router.get("/counties", getCounties);

export default router;
