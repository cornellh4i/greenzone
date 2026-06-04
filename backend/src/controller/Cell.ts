import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 * 10 });

export const getCellValuesbyYearandCtype = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { year, classificationType, lowerBound, upperBound } = req.params;
      const cacheKey = `${year}-${classificationType}-${lowerBound}-${upperBound}`;

      if (cache.has(cacheKey)) {
        res.status(200).json({
          log: "Cache hit",
          data: cache.get(cacheKey),
        });
        return;
      }

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
          log: "Invalid year. Please provide a valiernrjkd year.",
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

      const limit = 1000; // Number of rows per request
      let offset = 0;
      let allData: any[] = [];
      let hasMoreData = true;

      while (hasMoreData) {
        const { data, error } = await supabase
          .rpc("get_circle_data_by_category", {
            selected_year: selected_year,
            category_type: classificationType,
            gte: gte,
            lte: lt,
          })
          .range(offset, offset + limit - 1);

        if (error) {
          res.status(500).json({
            log: "Error while collecting the data",
            error: error.message,
          });
          return;
        }

        if (data && data.length > 0) {
          allData = allData.concat(data);
          offset += limit;
        } else {
          hasMoreData = false;
        }
      }

      console.log("Total rows returned from Supabase:", allData.length);
      cache.set(cacheKey, allData);
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
      const { data, error } = await supabase.rpc("get_years", {});

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

export const getCellCategorySummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { entityType, entityId, classificationType, selectedYear } =
        req.params;
      console.log("Entity Type:", entityType);
      console.log("Entity ID:", entityId);
      console.log("Classification Type:", classificationType);
      console.log("Selected Year:", selectedYear);
      const selected_year_parse = parseInt(selectedYear as string, 10);
      const entity_id_parse = parseInt(entityId as string, 10);
      console.log("Invalid year:", selected_year_parse);
      // check year
      if (
        isNaN(selected_year_parse) ||
        selected_year_parse < 2011 ||
        selected_year_parse > 2022
      ) {
        res.status(400).json({
          log: "Invalid year. Please prownw fnjwe jfide a valid year.",
        });
        return;
      }
      // check entity_type
      const { data, error } = await supabase.rpc("get_category_summary", {
        entity_type: entityType,
        entity_id: entity_id_parse,
        category_type: classificationType,
        selected_year: selectedYear,
      });
      if (error) {
        res.status(500).json({
          log: "Error while collecting wefhjbwehjfhe data",
          error: error.message,
        });
        return;
      }
      res.status(201).json({
        log: "Data was successfully collected",
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getMaps = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await fetch(
      "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch style: ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json({
      log: "Map style data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      log: "Failed to fetch map style",
      error: (error as Error).message,
    });
  }
};
