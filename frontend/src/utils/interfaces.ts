
export type Province = {
  Aimag: string;
  Year: number;
  Camel: number;
  Cattle: number;
  Goat: number;
  Horse: number;
  Sheep: number;
};

export type Provinces = {
  Aimag: string;
  Year: number[];
  Camel: number[];
  Cattle: number[];
  Goat: number[];
  Horse: number[];
  Sheep: number[];
};

export type Mongolia = {
  [Aimag: string]: Province[];
};