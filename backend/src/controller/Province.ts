import ProvinceModel from "../models/Province";
import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";

export const createProvince = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const province = req.body;
    console.log(province);

    // just double check if supabase client exists
    if (supabase) {
      const { data, error } = await supabase
        .from("Provinces")
        .insert([
          {
            province_id: province.province_id,
            province_data: province.province_data,
          },
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

// // THIS IS A TESTER FUNCTION
// export const createAllProvinces = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const feature = req.body;
//     console.log(feature);
//     const province = {
//       aid: feature.properties.aid,
//       province_name: feature.properties.name,
//       province_counties: feature.properties.province_counties,
//       province_land_area: feature.properties.province_land_area,
//       province_herders: feature.properties.herders,
//       province_number_of_livestock: feature.properties.livestock,
//       province_number_of_cattle: feature.properties.number_of_cattle,
//       province_number_of_goat: feature.properties.number_of_goat,
//       province_number_of_sheep: feature.properties.number_of_sheep,
//       province_number_of_camel: feature.properties.number_of_camel,
//       province_number_of_horse: feature.properties.number_of_horse,
//       geometry: feature.geometry,
//     };
//     console.log(province);
//     // Insert all provinces at once using insertMany for efficiency
//     const insertedProvinces = await new Province(province).save();

//     res.status(201).json(insertedProvinces);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };

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
      // Call the stored procedure using Supabase RPC
      const { data, error } = await supabase.rpc(
        "categorize_cells_by_province",
        {
          p_id: province_id,
          category_type: category_type,
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
    } catch (error: any) {
      res
        .status(500)
        .json({ log: "Internal server error", error: error.message });
    }
  }
};
