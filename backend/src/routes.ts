import express from "express";
import {
  createHexagon,
  getHexagons,
  getBelowHexagons,
  getAtCapHexagons,
  getAboveHexagons,
  updateHexagon,
  deleteHexagon,
} from "./controller/Hexagon";
import {
  createProvince,
  // createAllProvinces,
  // deleteProvince,
  getProvinces,
  // updateProvince,
  getProvinceByID,
  getProvinceGeometry,
  getProvinceGeometryByID,
  // getProvinceByName,
} from "./controller/Province";
import {
  createCounty,
  deleteCounty,
  getCounties,
  getCountyByID,
  updateCounty,
  getCountyGeometry,
  getCountyGeometryByID,
} from "./controller/County";
import {
  getBMCellsBelow,
  getBMCellsAtCap,
  getBMCellsAbove,
  getGrazingRangeTrue,
  getGrazingRangeFalse,
  getZScoreNegative,
  getZScoreZero,
  getZScorePositive,
} from "./controller/Cell";

const router = express.Router();

// Route to create a new hexagon
router.post("/hexagons", createHexagon);

// Route to get all hexagons
router.get("/hexagons", getHexagons);

//Route to get all hexagons with a bm_pred of <= 0.4
router.get("/hexagons/bm_pred_below", getBelowHexagons);

//Route to get all hexagons with a bm_pred between 0.4 and 0.6
router.get("/hexagons/bm_pred_at_cap", getAtCapHexagons);

//Route to get all hexagons with a bm_pred between 0.4 and 0.6
router.get("/hexagons/bm_pred_above", getAboveHexagons);

//Route to get all hexagons with a bm_pred of <= 0.4
router.get("/cells/bm_pred_below", getBMCellsBelow);

//Route to get all hexagons with a bm_pred between 0.4 and 0.6
router.get("/cells/bm_pred_at_cap", getBMCellsAtCap);

//Route to get all hexagons with a bm_pred between 0.4 and 0.6
router.get("/cells/bm_pred_above", getBMCellsAbove);

router.get("/cells/z_score_negative", getZScoreNegative);
router.get("/cells/z_score_zero", getZScoreZero);
router.get("/cells/z_score_positive", getZScorePositive);

// Route to update a hexagon
router.put("/hexagons/:hexagon_id", updateHexagon);

// Route to delete a hexagon
router.delete("/hexagons/:hexagon_id", deleteHexagon);

// Route to create a new province
router.post("/province", createProvince);

// Route to create all provinces
// router.post("/province/all", createAllProvinces);

// Route to get all provinces
router.get("/province", getProvinces);
router.get("/provincegeo", getProvinceGeometry);
router.get("/provincegeo/:province_id", getProvinceGeometryByID);

// router.get("/province/:province_name", getProvinceByName);

// Route to get a specific province by ID
router.get("/province/:province_id", getProvinceByID);

// Route to update a province
// router.put("/province/:province_id", updateProvince);

// Route to delete a province
// router.delete("/province/:province_id", deleteProvince);

// Route to create a new county
router.post("/county", createCounty);

// Route to get all counties
router.get("/county", getCounties);
router.get("/countygeo", getCountyGeometry);
router.get("/county/:county_id", getCountyByID);
router.get("/countygeo/:county_id", getCountyGeometryByID);

// Route to update a county
router.put("/county/:county_id", updateCounty);

// Route to delete a county
router.delete("/county/:county_id", deleteCounty);

// Add these new routes
router.get("/cells/grazing_range_true", getGrazingRangeTrue);
router.get("/cells/grazing_range_false", getGrazingRangeFalse);

export default router;
