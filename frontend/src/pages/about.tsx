import React from "react";
import ScatterLinePlot from "@/components/charts/scatter-line-plot";
import data from "@/components/charts/data/mongolia-province-data.json";

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

  interface Mongolia {
    [Aimag: string]: Province[];
  };

  const organizedData: Mongolia = data;

  function extractData(province: Mongolia): {Aimag: string, Year: number[], Camel: number[], Cattle: number[], Goat: number[], Horse: number[], Sheep: number[]}[] {
    const result: {Aimag: string, Year: number[], Camel: number[], Cattle: number[], Goat: number[], Horse: number[], Sheep: number[]}[] = [];

    for (const Aimag in province) {
      if (province.hasOwnProperty(Aimag)) {
        const years = province[Aimag].map((aimag) => aimag.Year);
        const camel = province[Aimag].map((aimag) => aimag.Camel);
        const cattle = province[Aimag].map((aimag) => aimag.Cattle);
        const goat = province[Aimag].map((aimag) => aimag.Goat);
        const horse = province[Aimag].map((aimag) => aimag.Horse);
        const sheep = province[Aimag].map((aimag) => aimag.Sheep);

        result.push({Aimag, Year: years, Camel: camel, Cattle: cattle, Goat: goat, Horse: horse, Sheep: sheep});
        }
      }
      return result;
    }

  function groupByYear(province: Province[], field: keyof Province): { x: number; y: number }[] {
    const result: { x: number; y: number }[] = [];

    const year: { [Year: number]: Province[] } = {};
    province.forEach((aimag) => {
      if (!year[aimag.Year]) {
        year[aimag.Year] = [];
      }
      year[aimag.Year].push(aimag);
    });

    Object.entries(year).map(([Year, province]) => {
      const sum = province.reduce((acc, curr) => acc + (curr[field] as number), 0);
      const average = sum / province.length;
      result.push({ x: Number(Year), y: average });
    });
    return result;
  }

    const extractedDataWithKeys = extractData(organizedData);
    const SuhbaatarGoats = groupByYear(organizedData.Suhbaatar, "Goat");
    console.log(extractedDataWithKeys);


  return (
  <div>
    <ScatterLinePlot info={SuhbaatarGoats} minRange={2002} maxRange={2014}/>
  </div>
  );
};

export default About;

