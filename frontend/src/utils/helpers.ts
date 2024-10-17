import { Mongolia, Provinces } from "@/utils/interfaces";
import { Props } from "@/components/charts/groupedbarchart";
import { Prop } from "@/components/charts/scatter-line-plot";


export const extractData = (province: Mongolia) => {
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
};

export const groupByYear = (
  data: number[],
  yearValues: number[]
): { x: number; y: number }[] => {
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
};

export const groupByLivestockAndYear = (
  year: number,
  livestock: string[],
  provinces: Provinces[]
): Props["datasets"] => {
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
};

export const createMultipleDatasets = (
  provinces: Provinces[],
  field: keyof Provinces
): Prop["datasets"] => {
  const datasets: { aimag: string; data: { x: number; y: number }[] }[] = [];
  provinces.map((province) =>
    datasets.push({
      aimag: province.Aimag,
      data: groupByYear(province[field] as number[], province.Year),
    })
  );
  return datasets;
};

export const extractYearRange = (provinces: Provinces[]): Set<number> => {
  const rangeEntries = new Set<number>();

  provinces.map((province) =>
    province.Year.map((year) => rangeEntries.add(year))
  );
  return rangeEntries;
};

