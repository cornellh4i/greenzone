import Hexagon from "../models/Hexagon";
import { Request, Response } from "express";

// Create a new hexagon
export const createHexagon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feature = req.body ;

    // Define the hexagon object based on the new structure
    const hexagonData = {
      grid_id: feature.properties.grid_id,
      grid_area: feature.properties.grid_area,
      aid: feature.properties.aid,
      sid: feature.properties.sid,
      asid: feature.properties.asid,
      soum_utm_crs: feature.properties.soum_utm_crs,
      attribute_1: feature.properties.attribute_1,
      area_km2: feature.properties.area_km2,
      province_number_of_livestock: feature.properties.livestock,
      province_herders: feature.properties.herders,
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

export const getBelowHexagons = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hexagonsBelow = await Hexagon.find({ bm_pred: { $lte: 0.4 } });

    res.status(200).json(hexagonsBelow);
  } catch (error: any) {
    // Use 'any' type
    res.status(500).json({ message: error.message });
  }
};

export const getAtCapHexagons = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hexagonsAtCap = await Hexagon.find({
      bm_pred: { $gt: 0.4, $lt: 0.6 },
    });

    res.status(200).json(hexagonsAtCap);
  } catch (error: any) {
    // Use 'any' type
    res.status(500).json({ message: error.message });
  }
};

export const getAboveHexagons = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hexagonsAbove = await Hexagon.find({
      bm_pred: { $gte: 0.6 },
    });

    res.status(200).json(hexagonsAbove);
  } catch (error: any) {
    // Use 'any' type
    res.status(500).json({ message: error.message });
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
