import React from "react";

import data from "@/components/charts/data/mongolia-province-data.json";
import { Prop } from "@/components/charts/scatter-line-plot";
import { Props } from "@/components/charts/groupedbarchart";

import DropDown from "@/components/atoms/DropDown";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { useState } from "react";
import SidePanel from "@/components/organisms/SidePanel";
import BarChart from "@/components/charts/barchart";

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

  const selectedOption: string | null = null;

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setSelectedAimag(null);
  };

  function extractYearRange(provinces: Provinces[]): Set<number> {
    const rangeEntries = new Set<number>();

    provinces.map((province) =>
      province.Year.map((year) => rangeEntries.add(year))
    );
    return rangeEntries;
  }

  const extractedDataWithKeys = extractData(organizedData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goats = createMultipleDatasets(extractedDataWithKeys, "Goat");

  const yearRange = Array.from(extractYearRange(extractedDataWithKeys)).sort(
    (a, b) => a - b
  );
  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];

  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number | null>(
    Math.max(...yearRange)
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleSearchResult = (aimag: string | null) => {
    if (aimag) {
      setSelectedAimag(aimag);
      const yearToUse = selectedYear || Math.max(...yearRange);

      const filtered = groupByLivestockAndYear(
        yearToUse,
        livestockTypes,
        extractedDataWithKeys.filter(
          (dataset) =>
            dataset.Aimag === aimag && dataset.Year.includes(yearToUse)
        )
      );
      setFilteredData(filtered);
    } else {
      setSelectedAimag(null);
      setFilteredData([]);
    }
  };

  const handleYearChange = (year: string | null) => {
    if (year) {
      const yearAsNumber = Number(year);
      setSelectedYear(yearAsNumber);
      const aimagToUse = selectedAimag;

      const filtered = groupByLivestockAndYear(
        yearAsNumber,
        livestockTypes,
        extractedDataWithKeys.filter(
          (dataset) =>
            (!aimagToUse || dataset.Aimag === aimagToUse) &&
            dataset.Year.includes(yearAsNumber)
        )
      );
      setFilteredData(filtered);
    } else {
      setSelectedYear(null);
      setFilteredData([]);
    }
  };

  return (
    <div>
      <Button onClick={handlePanelToggle} label="Toggle SidePanel" />
      <SidePanel isOpen={isPanelOpen} onClose={handlePanelToggle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 11, marginRight: "1rem" }}>
            <SearchBar onSearch={handleSearchResult} />
          </div>
        </div>
        {/* <ScatterLinePlot datasets={goats} livestock={"Goats"} /> */}
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
        >
          <div style={{ flex: 11, marginRight: "1rem" }}>
            <DropDown
              options={yearRange.map((year) => year.toString())}
              value={selectedOption}
              onChange={handleYearChange}
              label="Select a year"
            />
          </div>
        </div>
        {selectedAimag && filteredData.length > 0 && (
          <div>
            <BarChart datasets={filteredData} livestock={livestockTypes} />
          </div>
        )}
      </SidePanel>
    </div>
  );
};

export default About;
