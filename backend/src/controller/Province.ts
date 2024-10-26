import Province from "../models/Province";
import { Request, Response } from "express";

export const createProvince = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const province = new Province(req.body);
    await province.save();
    res.status(201).json(province);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProvinces = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hexagons = await Province.find();
    res.status(200).json(Province);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
