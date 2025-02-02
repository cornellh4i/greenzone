import ProvinceModel from "../models/Province";
import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";

export const createProvince = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const province = req.body;
    console.log(province)

    // just double check if supabase client exists
    if (supabase) {
      const { data, error } = await supabase
        .from("Provinces")
        .insert([
          { province_id: province.province_id, province_data: province.province_data },
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
        .select("province_id,province_geometry");
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

// // Get a province by name
// export const getProvinceByName = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { province_name } = req.params;
//   console.log(province_name);
//   try {
//     const province = await Province.findOne({ province_name: province_name });
//     if (!province) {
//       res.status(404).json({ message: "Provinceqwcqwdqwd not foundwvefewfwe" });
//       return;
//     }
//     res.status(200).json(province);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateProvince = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { province_id } = req.params;
//     const updatedData = req.body;
//     console.log("were in update");
//     console.log(req.params);
//     const province = await ProvinceModel.findOneAndUpdate(
//       { province_name: province_id },
//       updatedData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!province) {
//       res
//         .status(404)
//         .json({ message: "Provincvwervwefweeqwcqwdqwd not found" });
//     } else {
//       res.status(200).json(province);
//     }
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteProvince = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { province_id } = req.params;

//     const province = await ProvinceModel.findByIdAndDelete(province_id);

//     if (!province) {
//       res.status(404).json({ message: "Province not found" });
//     } else {
//       res.status(200).json(province);
//     }
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };
