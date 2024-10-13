// routes/hexagonRoutes.js
const express = require("express");
const hexagonController = require("./controller");

const router = express.Router();

// Route to add hexagons from GeoJSON data
router.post("/hexagons", hexagonController.createHexagons);

// Route to get all hexagons
router.get("/hexagons", hexagonController.getHexagons);

module.exports = router;
