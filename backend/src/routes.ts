import express from "express";
import { createHexagon, getHexagons } from "./controller/Hexagon";

const router = express.Router();

// Route to create a new hexagon
router.post("/hexagons", createHexagon);

// Route to get all hexagons
router.get("/hexagons", getHexagons);

export default router;
