import { count } from "console";
import County from "../models/County";
import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";

// Create a new county
export const createCounty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const county = req.body;

    // just double check if supabase client exists
    if (supabase) {
      const { data, error } = await supabase
        .from("Counties")
        .insert([
          { county_id: county.county_id, county_data: county.county_data },
        ])
        .select();

      // error handling in case the insertion doesn't work
      if (error) {
        res.status(500).json({
          log: "Error while inserting the data",
          error: error.message,
        });
        return;
      }
      res
        .status(201)
        .json({ log: "Data was successfully inserted", data: data });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all counties
export const getCounties = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Counties")
        .select("county_id,province_id,county_data");
      // error handling in case the collection doesn't work
      if (error) {
        res.status(500).json({
          log: "Error while collecting the data",
          error: error.message,
        });
        return;
      }
      res
        .status(201)
        .json({ log: "Data was successfully Collected", data: data });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};
export const getCountyGeometry = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Counties")
        .select("county_id,province_id,county_geometry");
      // error handling in case the insertion doesn't work
      if (error) {
        res.status(500).json({
          log: "Error while collecting the data",
          error: error.message,
        });
        return;
      }
      res
        .status(201)
        .json({ log: "Data was successfully Collected", data: data });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getCountyByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { county_id } = req.params;
      const { data, error } = await supabase
        .from("Counties")
        .select("county_id,province_id,county_data")
        .eq("county_id", county_id);
      // error handling in case the insertion doesn't work
      if (error) {
        res.status(500).json({
          log: "Error while collecting the data",
          error: error.message,
        });
        return;
      }
      res
        .status(201)
        .json({ log: "Data was successfully Collected", data: data });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getCountyGeometryByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { county_id } = req.params;
      const { data, error } = await supabase
        .from("Counties")
        .select("county_id,province_id,county_geometry")
        .eq("county_id", county_id);
      // error handling in case the insertion doesn't work
      if (error) {
        res.status(500).json({
          log: "Error while collecting the data",
          error: error.message,
        });
        return;
      }
      res
        .status(201)
        .json({ log: "Data was successfully Collected", data: data });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};

// export const getCounties = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const counties = await County.find();
//     res.status(200).json(counties);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
