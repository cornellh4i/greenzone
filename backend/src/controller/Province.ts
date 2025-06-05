import ProvinceModel from "../models/Province";
import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";

export const getProvinces = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Provinces")
        .select("province_id,province_data");
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

export const getProvinceGeometry = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("Provinces")
        .select("province_id, province_data->province_name, province_geometry");
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

export const getProvinceByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { province_id } = req.params;
      const { data, error } = await supabase
        .from("Provinces")
        .select("province_id,province_data")
        .eq("province_id", province_id);
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

export const getProvinceGeometryByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { province_id } = req.params;
      const { data, error } = await supabase
        .from("Provinces")
        .select("province_id,province_geometry")
        .eq("province_id", province_id);
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

export const getProvinceLivestockByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { province_id, year } = req.params;
      const { data, error } = await supabase
        .from("province_livestock")
        .select("yearly_agg")
        .eq("asid_prefix", province_id)
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

export const getProvinceLivestockByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { type } = req.params;
      const { data, error } = await supabase.rpc("fetch_livestock_by_class", {
        livestock_type: type,
      });
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

export const getProvinceCellSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const province_id = parseInt(req.params.province_id as string, 10);
      const category_type = req.params.category_type as string;

      // Validate province_id
      if (province_id < 11 || province_id > 85) {
        res.status(400).json({
          log: "Invalid province_id. It must be a valid number.",
        });
        return;
      }

      // Validate category_type
      if (!["carrying_capacity", "z_score"].includes(category_type)) {
        res.status(400).json({
          log: "Invalid category type. Use 'carrying_capacity' or 'z_score'.",
        });
        return;
      }

      // Fetch data
      const { data, error } = await supabase.rpc("get_category_summary", {
        p_id: 22,
        category_type: "z_score",
        selected_year: 2023, // Assuming a default year, can be modified as needed
      });

      if (error) {
        res.status(500).json({
          log: "Error while collecting the data",
          error: error.message,
        });
        return;
      }

      res
        .status(200)
        .json({ log: "Data was successfully collected", data: data });
    } catch (error: any) {
      res
        .status(500)
        .json({ log: "Internal server error", error: error.message });
    }
  }
};

export const getProvinceGR = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!supabase) {
    res.status(500).json({ log: "Supabase connection is missing." });
    return;
  }

  try {
    console.log("Incoming request params:", req.params);

    const { province_id } = req.params;
    console.log(`Extracted province_id: ${province_id}`);

    const parsedProvinceId = parseInt(province_id, 10);
    console.log(`Parsed province_id: ${parsedProvinceId}`);

    // Validate province_id
    if (
      isNaN(parsedProvinceId) ||
      parsedProvinceId < 11 ||
      parsedProvinceId > 85
    ) {
      console.error("Invalid province_id:", parsedProvinceId);
      res
        .status(400)
        .json({ log: "Invalid province_id. It must be a valid number." });
      return;
    }

    // Log before calling the RPC
    console.log(`Calling Supabase RPC with p_id: ${parsedProvinceId}`);

    // Call Supabase function
    const { data, error } = await supabase.rpc(
      "find_grazing_range_percentage",
      {
        p_id: parsedProvinceId,
      }
    );

    // Log response from Supabase
    console.log("Supabase RPC Response:", { data, error });

    if (error) {
      console.error("Supabase RPC Error:", error.message);
      res.status(500).json({
        log: "Error while collecting grazing range data",
        error: error.message,
      });
      return;
    }

    console.log("Grazing Range Percentage Data:", data);
    res.status(200).json({ log: "Grazing range percentage retrieved", data });
  } catch (error: any) {
    console.error("Unexpected Server Error:", error.message);
    res
      .status(500)
      .json({ log: "Internal server error", error: error.message });
  }
};
