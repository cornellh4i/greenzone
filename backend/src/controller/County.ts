import { count } from "console";
import County from "../models/County";
import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";

// Get all counties
export const getCounties = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("County_Data")
        .select("id,name,province_id,province_name");
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
      const selected_year_parse = parseInt(year as string, 10);
      // check year
      if (
        isNaN(selected_year_parse) ||
        selected_year_parse < 2011 ||
        selected_year_parse > 2022
      ) {
        res.status(400).json({
          log: "Invalid year. Please provide a valid year.",
        });
        return;
      }
      const { data, error } = await supabase.rpc(
        "retrieve_livestock_by_entity",
        {
          entity_type: "county",
          input_entity_id: county_id,
          selected_year: selected_year_parse,
        }
      );
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
        "retrive_counties_geom_province",
        {
          input_province_id: province_id,
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
