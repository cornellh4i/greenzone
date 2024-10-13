// // const mongoose = require("mongoose");
// const fs = require("fs");
// const path = require("path");
// const Hexagon = require("./models/Hexagon"); // Adjust the path if necessary

// // Load environment variables
// require("dotenv").config({ path: "config.env" });

// // Load GeoJSON file
// const geoJsonPath = path.join(__dirname, "../green_zone_hex_map.geojson");
// const geoJsonData = JSON.parse(fs.readFileSync(geoJsonPath, "utf-8"));

// async function importHexagons() {
//   console.log("hereee");
//   const geoJsonPath = path.join(
//     __dirname,
//     "backend/green_zone_hex_map.geojson"
//   );
//   const geoJsonData = JSON.parse(fs.readFileSync(geoJsonPath, "utf-8"));
//   try {
//     for (const feature of geoJsonData.features) {
//       const hexagonData = {
//         geometry: feature.geometry,
//         grid_area: feature.properties.grid_area,
//         aid: feature.properties.aid,
//         sid: feature.properties.sid,
//         asid: feature.properties.asid,
//         soum_utm_crs: feature.properties.soum_utm_crs,
//         attribute_1: feature.properties.attribute_1,
//         area_km2: feature.properties.area_km2,
//         livestock: feature.properties.livestock,
//         herders: feature.properties.herders,
//       };

//       const hexagon = new Hexagon(hexagonData);
//       await hexagon.save();
//       console.log("Saved hexagon:", hexagon);
//     }
//     console.log("All hexagons imported successfully!");
//   } catch (error) {
//     console.error("Error importing hexagons:", error);
//   }
// }

// module.exports = importHexagons;
