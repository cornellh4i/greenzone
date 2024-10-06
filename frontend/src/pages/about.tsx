import React from "react";
import ScatterLinePlot from "@/components/charts/scatter-line-plot";
import data from "@/components/charts/data/mongolia-province-data.json";
import { Prop } from "@/components/charts/scatter-line-plot";
import { Props } from "@/components/charts/barchart";
import BarChart from "@/components/charts/barchart";
import TextBox from "@/components/atoms/TextBox";
import DropDown from "@/components/atoms/DropDown";
import Button from "@/components/atoms/Button";

/** An About page */
const About = () => {
  interface Province {
    Aimag: string;
    Year: number;
    Camel: number;
    Cattle: number;
    Goat: number;
    Horse: number;
    Sheep: number;
  }

  interface Provinces {
    Aimag: string;
    Year: number[];
    Camel: number[];
    Cattle: number[];
    Goat: number[];
    Horse: number[];
    Sheep: number[];
  }

  interface Mongolia {
    [Aimag: string]: Province[];
  }

  const organizedData: Mongolia = data;

  function extractData(province: Mongolia): Provinces[] {
    const result: Provinces[] = [];

    for (const Aimag in province) {
      if (province.hasOwnProperty(Aimag)) {
        const years = province[Aimag].map((aimag) => aimag.Year);
        const camel = province[Aimag].map((aimag) => aimag.Camel);
        const cattle = province[Aimag].map((aimag) => aimag.Cattle);
        const goat = province[Aimag].map((aimag) => aimag.Goat);
        const horse = province[Aimag].map((aimag) => aimag.Horse);
        const sheep = province[Aimag].map((aimag) => aimag.Sheep);

        result.push({
          Aimag,
          Year: years,
          Camel: camel,
          Cattle: cattle,
          Goat: goat,
          Horse: horse,
          Sheep: sheep,
        });
      }
    }
    return result;
  }

  function groupByYear(
    data: number[],
    yearValues: number[]
  ): { x: number; y: number }[] {
    const result: { x: number; y: number }[] = [];

    const years: { [year: number]: number[] } = {};

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const year = yearValues[i];

      if (years[year] === undefined) {
        years[year] = [];
      }
      years[year].push(value);
    }

    Object.entries(years).forEach(([year, values]) => {
      const average =
        values.reduce((acc, curr) => acc + curr, 0) / values.length;
      result.push({ x: Number(year), y: average });
    });

    return result;
  }

  function groupByLivestockAndYear(
    year: number,
    livestock: string[],
    provinces: Provinces[]
  ): Props["datasets"] {
    return provinces
      .filter((province) => province.Year.includes(year))
      .map((province) => {
        const yearIndex = province.Year.indexOf(year);

        return {
          aimag: province.Aimag,
          data: livestock.map((livestockType) => ({
            x: livestockType,
            y: (province[livestockType as keyof Provinces]?.[yearIndex] ??
              0) as number,
          })),
        };
      });
  }

  function createMultipleDatasets(
    provinces: Provinces[],
    field: keyof Provinces
  ): Prop["datasets"] {
    const datasets: { aimag: string; data: { x: number; y: number }[] }[] = [];
    provinces.map((province) =>
      datasets.push({
        aimag: province.Aimag,
        data: groupByYear(province[field] as number[], province.Year),
      })
    );
    return datasets;
  }

  const extractedDataWithKeys = extractData(organizedData);
  const goats = createMultipleDatasets(extractedDataWithKeys, "Goat");
  const testingGroupedBars = groupByLivestockAndYear(
    2014,
    ["Cattle", "Horse", "Goat"],
    extractedDataWithKeys
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 11, marginRight: "1rem" }}>
          <TextBox textLabel="Search" />
        </div>
        <div style={{ flex: 1 }}>
          <Button children={"Search"} color="dark-gray" />
        </div>
      </div>
      <DropDown label="Year" data={data} />
      <ScatterLinePlot datasets={goats} livestock={"Goats"} />
      <BarChart
        datasets={testingGroupedBars}
        livestock={["Cattle", "Horse", "Goat"]}
      />
    </div>
  );
};

export default About;
