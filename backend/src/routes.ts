import express from "express";

import {
  getProvinces,
  getProvinceByID,
  getProvinceGeometry,
  getProvinceGeometryByID,
  getProvinceLivestockByID,
  getProvinceLivestockByClass,
  getProvinceCellSummary,
  getProvinceGR,
} from "./controller/Province";
import {
  getCounties,
  getCountyByID,
  getCountyGeometry,
  getCountyGeometryByID,
  getCountyLivestockByID,
  getCountyCellSummary,
  getCountiesGeomInProvince,
} from "./controller/County";

import { SignupUser, CanResetPassword } from "./users";

import {
  getCellValuesbyYearandCtype,
  getYearOptions,
  getCellCategorySummary,
  getMaps,
} from "./controller/Cell";

const router = express.Router();

router.get(
  "/cells/:year/:classificationType/:lowerBound/:upperBound",
  getCellValuesbyYearandCtype
);
router.get(
  "/cell/:entityType/:entityId/:classificationType/:selectedYear",
  getCellCategorySummary
);
router.get("/cells/yearOptions", getYearOptions);

// Route to get all provinces
router.get("/province", getProvinces);
router.get("/provincegeo", getProvinceGeometry);
router.get("/provincebyclass/:type", getProvinceLivestockByClass);
router.get("/province/:province_id", getProvinceByID);
router.get("/province/:province_id/:year/livestock", getProvinceLivestockByID);

// Route to create a new county
router.get("/county", getCounties);
router.get("/countygeo", getCountyGeometry);
router.get("/county/geom/:province_id", getCountiesGeomInProvince);
router.get("/county/:county_id", getCountyByID);
router.get("/countygeo/:county_id", getCountyGeometryByID);
router.get("/county/:county_id/:year/livestock", getCountyLivestockByID);
router.get("/maps", getMaps);

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  try {
    const response = await SignupUser(
      email,
      password,
      firstName,
      lastName,
      role
    );
    if (response instanceof Error) {
      res.status(400).json({ message: response });
    } else {
      res
        .status(200)
        .json({ message: "User signed up successfully", response });
      console.log("working", response);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/can-reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    const response = await CanResetPassword(email);
    if (response instanceof Error) {
      res.status(400).json({ message: response });
    } else {
      res.status(200).json({ message: "Reset password email sent", response });
      console.log("working", response);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
