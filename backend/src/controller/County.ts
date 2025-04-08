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

export const getCountyLivestockByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { county_id, year } = req.params;
      const { data, error } = await supabase
        .from("county_livestock")
        .select("yearly_agg")
        .eq("asid", county_id)
        .eq("year", year);
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

export const getCountyCellSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const county_id = parseInt(req.params.county_id as string, 10);
      const category_type = req.params.category_type as string;

      // Validate category_type
      if (!["carrying_capacity", "z_score"].includes(category_type)) {
        res.status(400).json({
          log: "Invalid category type. Use 'carrying_capacity' or 'z_score'.",
        });
        return;
      }
      // Call the stored procedure using Supabase RPC
      const { data, error } = await supabase.rpc("categorize_cells_by_county", {
        c_id: county_id,
        category_type: category_type,
      });
      // Error handling in case the query fails
      if (error) {
        res.status(500).json({
          log: "Error while collecting the data",
          error: error.message,
        });
        return;
      }

      res
        .status(201)
        .json({ log: "Data was successfully collected", data: data });
    } catch (error: any) {
      res
        .status(500)
        .json({ log: "Internal server error", error: error.message });
    }
  }
};
export const getCountiesGeomInProvince = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const province_id = parseInt(req.params.province_id as string, 10);
      const { data, error } = await supabase.rpc(
        "retrieve_counties_geom_in_province",
        {
          p_id: province_id,
        }
      );
      // Error handling in case the query fails
      if (error) {
        res.status(500).json({
          log: "Error while collecting the data",
          error: error.message,
        });
        return;
      }

      res
        .status(201)
        .json({ log: "Data was successfully collected", data: data });
    } catch (error) {}
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

export const getCountyCellSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const county_id = parseInt(req.params.county_id as string, 10);
      const category_type = req.params.category_type as string;

      if (isNaN(county_id)) {
        res.status(400).json({ log: "Invalid county_id. It must be a number." });
        return;
      }

      if (!["carrying_capacity", "z_score"].includes(category_type)) {
        res.status(400).json({
          log: "Invalid category type. Use 'carrying_capacity' or 'z_score'.",
        });
        return;
      }

      const { data, error } = await supabase.rpc(
        "categorize_cells_by_county",
        {
          c_id: county_id,
          category_type: category_type,
        }
      );

      if (error) {
        res.status(500).json({
          log: "Error while collecting data from SQL function",
          error: error.message,
        });
        return;
      }

      res.status(200).json({ log: "Data collected successfully", data: data || [] });
    } catch (error: any) {
      console.error("Server Error:", error);
      res.status(500).json({ log: "Internal server error", error: error.message });
    }
  }
};