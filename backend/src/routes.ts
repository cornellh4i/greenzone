import express from "express";
import { createHexagon, getHexagons } from "./controller/Hexagon";
import { createProvince, getProvinces } from "./controller/Province";

const router = express.Router();

// Route to create a new hexagon
router.post("/hexagons", createHexagon);

// Route to get all hexagons
router.get("/hexagons", getHexagons);

// Route to create a new province
router.post("/provinces", createProvince);

// Route to get all provinces
router.get("/provinces", getProvinces);

export default router;
