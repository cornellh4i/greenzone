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
    const province = await Province.find();
    res.status(200).json(province);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProvince = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { province_id } = req.params;
    const updatedData = req.body;

    const province = await Province.findByIdAndUpdate(
      province_id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(province);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
