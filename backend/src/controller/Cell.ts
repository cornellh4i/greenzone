import { Request, Response } from "express";
import { supabase } from "../db/postgresconn";

export const getBMCellsBelow = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .lt("bm_pred", 0.4);
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
export const getBMCellsAtCap = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .gte("bm_pred", 0.4)
        .lt("bm_pred", 0.6);
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
export const getBMCellsAbove = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .gte("bm_pred", 0.6);
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

export const getGrazingRangeTrue = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .eq("grazing_range", true);

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

export const getGrazingRangeFalse = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .eq("grazing_range", false);

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

export const getZScoreNegative = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .lt("z_score", 0.4);

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

export const getZScoreZero = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .gte("z_score", 0.4)
        .lt("z_score", 0.6);

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

export const getZScorePositive = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("circle_grid")
        .select()
        .gte("z_score", 0.6);

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
      if (isNaN(selected_year) || selected_year < 2011 || selected_year > 2022) {
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

      const { data, error } = await supabase.rpc("categorize_cells_by_year", {
        selected_year: selected_year,
        category_type: classificationType,
        gte: gte,
        lt: lt,
      });

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