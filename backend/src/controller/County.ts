import { count } from "console";
import County from "../models/County";
import { Request, Response } from "express";

// Create a new county
export const createCounty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const county = new County(req.body);
    await county.save();
    res.status(201).json(county);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all counties
export const getCounties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const counties = await County.find();
    res.status(200).json(counties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCounty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { county_id } = req.params;
    const updatedData = req.body;

    const county = await County.findByIdAndUpdate(county_id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!county) {
      res.status(404).json({ message: "County not found" });
    } else {
      res.status(200).json(county);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCounty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { county_id } = req.params;

    const county = await County.findByIdAndDelete(county_id);

    if (!county) {
      res.status(404).json({ message: "County not found" });
    } else {
      res.status(200).json(county);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
