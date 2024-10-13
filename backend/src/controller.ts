// controllers/hexagonController.js
const Hexagon = require("./models/Hexagon");

// POST /hexagons - Create and save hexagons from GeoJSON data
const createHexagons = async (req: any, res: any) => {
  try {
    const { feature } = req.body; // Extract GeoJSON features

    // Iterate through each feature and save to database
    const hexagons = {
      geometry: feature.geometry,
      grid_area: feature.properties.grid_area,
      aid: feature.properties.aid,
      sid: feature.properties.sid,
      asid: feature.properties.asid,
      soum_utm_crs: feature.properties.soum_utm_crs,
      attribute_1: feature.properties.attribute_1,
      area_km2: feature.properties.area_km2,
      livestock: feature.properties.livestock,
      herders: feature.properties.herders,
    };

    // Insert hexagons into the database
    await Hexagon.create(hexagons);

    res.status(201).json({
      message: "Hexagons added successfully",
      data: hexagons,
    });
  } catch (error) {
    console.error("Error adding hexagons:", error);
    res.status(500).json({ message: "Failed to add hexagons", error });
  }
};

// GET /hexagons - Retrieve all hexagons from the database
const getHexagons = async (req: any, res: any) => {
  try {
    const hexagons = await Hexagon.find(); // Retrieve all hexagons
    res.status(200).json({ data: hexagons });
  } catch (error) {
    console.error("Error fetching hexagons:", error);
    res.status(500).json({ message: "Failed to fetch hexagons", error });
  }
};
// Exports
module.exports = {
  createHexagons,
  getHexagons,
};
