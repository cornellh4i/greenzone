import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";

export const getCellValuesbyYearandCtype = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { year, classificationType, lowerBound, upperBound } = req.params;

      const selected_year = parseInt(year as string, 10);
      const gte = parseFloat(lowerBound as string);
      const lt = parseFloat(upperBound as string);

      // Validate year
      if (
        isNaN(selected_year) ||
        selected_year < 2011 ||
        selected_year > 2022
      ) {
        res.status(400).json({
          log: "Invalid year. Please provide a valid year.",
        });
        return;
      }

      // Validate classificationType
      if (!["carrying_capacity", "z_score"].includes(classificationType)) {
        res.status(400).json({
          log: "Invalid classificationType. Use 'carrying_capacity' or 'z_score'.",
        });
        return;
      }

      // Validate lowerBound and upperBound
      if (
        isNaN(gte) ||
        isNaN(lt) ||
        gte < 0.0 ||
        gte > 1.0 ||
        lt < 0.0 ||
        lt > 1.0 ||
        gte >= lt
      ) {
        res.status(400).json({
          log: "Invalid bounds. lowerBound must be less than upperBound and both must be between 0.0 and 1.0.",
        });
        return;
      }

      console.log("Selected Year:", selected_year);
      console.log("Category Type:", classificationType);
      console.log("GTE:", gte);
      console.log("LT:", lt);

      // Pagination variables
      const limit = 1000; // Number of rows per request
      let offset = 0;
      let allData: any[] = [];
      let hasMoreData = true;

      while (hasMoreData) {
        const { data, error } = await supabase
          .rpc("categorize_cells_by_year_flat", {
            selected_year: selected_year,
            category_type: classificationType,
            gte: gte,
            lt: lt,
          })
          .range(offset, offset + limit - 1); // Fetch rows in chunks

        if (error) {
          res.status(500).json({
            log: "Error while collecting the data",
            error: error.message,
          });
          return;
        }

        if (data && data.length > 0) {
          allData = allData.concat(data); // Append fetched data to the result
          offset += limit; // Move the offset for the next chunk
        } else {
          hasMoreData = false; // No more data to fetch
        }
      }

      console.log("Total rows returned from Supabase:", allData.length);

      res.status(201).json({
        log: "Data was successfully collected",
        data: allData,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};


export const getYearOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("new_yearly_cell_data")
        .select("year")

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