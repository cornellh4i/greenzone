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
