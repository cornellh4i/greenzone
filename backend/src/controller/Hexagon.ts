import Hexagon from "../models/Hexagon";
import { Request, Response } from "express";

// Create a new hexagon
export const createHexagon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feature = req.body;

    // Define the hexagon object based on the new structure
    const hexagonData = {
      grid_id: feature.properties.grid_id,
      aid: feature.properties.aid,
      sid: feature.properties.sid,
      asid: feature.properties.asid,
      utm_crs: feature.properties.utm_crs,
      bm_pred: feature.properties.bm_pred,
      area_km2: feature.properties.area_km2,
      livestock: feature.properties.livestock,
      herders: feature.properties.herders,
      geometry: feature.geometry,
    };

    // Create a new Hexagon instance and save it to the database
    const hexagon = new Hexagon(hexagonData);
    console.log(hexagon);
    await hexagon.save();

    // Send the created hexagon as the response
    res.status(201).json(hexagon);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all hexagons
export const getHexagons = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hexagons = await Hexagon.find();
    res.status(200).json(hexagons);
  } catch (error: any) {
    // Use 'any' type
    res.status(500).json({ message: error.message });
  }
};

// Update a hexagon
export const updateHexagon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { hexagon_id } = req.params;
    const updatedData = req.body;

    const hexagon = await Hexagon.findByIdAndUpdate(hexagon_id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!hexagon) {
      res.status(404).json({ message: "Hexagon not found" });
    } else {
      res.status(200).json(hexagon);
    }
  } catch (error: any) {
    // Use 'any' type
    res.status(400).json({ message: error.message });
  }
};

// Delete a hexagon
export const deleteHexagon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { hexagon_id } = req.params;
    const hexagon = await Hexagon.findByIdAndDelete(hexagon_id);

    if (!hexagon) {
      res.status(404).json({ message: "Hexagon not found" });
    } else {
      res.status(200).json(hexagon);
    }
  } catch (error: any) {
    // Use 'any' type
    res.status(400).json({ message: error.message });
  }
};
