import Hexagon from "../models/Hexagon";
import { Request, Response } from "express";

// Create a new hexagon
export const createHexagon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hexagon = new Hexagon(req.body);
    await hexagon.save();
    res.status(201).json(hexagon);
  } catch (error: any) {
    // Use 'any' type
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

    const hexagon = await Hexagon.findByIdAndUpdate(
      hexagon_id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

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