import { Class } from "leaflet";
import { SetStateAction, createContext } from "react";

export type SetState<T> = React.Dispatch<SetStateAction<T>>;
export enum LayerType {
  CarryingCapacity = "carrying_capacity",
  ZScore = "z_score",
}
export type GlobalContext = {
  selectedProvince: number | null;
  setSelectedProvince: SetState<number>;
  selectedYear: number;
  setSelectedYear: SetState<number>;
  isPanelOpen: boolean | null;
  setIsPanelOpen: SetState<boolean>;
  isTopPanelOpen: boolean | null;
  setTopPanelOpen: SetState<boolean>;
  searched: number | null;
  setSearched: SetState<number>;
  selectedOption: string | null; //"carryingCapacity"
  setSelectedOption: SetState<string>;
  displayName: string;
  setDisplayName: SetState<string>;

  /////////////////////////////////////////

  selectedLayerType: LayerType | null;
  setSelectedLayerType: SetState<LayerType>;

  showBelowCells: boolean | null;
  setShowBelowCells: SetState<boolean>;
  showAtCapCells: boolean | null;
  setShowAtCapCells: SetState<boolean>;
  showAboveCells: boolean | null;
  setShowAboveCells: SetState<boolean>;

  // Z-Score NDVI Related

  showNegativeCells: boolean | null;
  setShowNegativeCells: SetState<boolean>;
  showZeroCells: boolean | null;
  setShowZeroCells: SetState<boolean>;
  showPositiveCells: boolean | null;
  setShowPositiveCells: SetState<boolean>;

  grazingRange: boolean | null;
  setGrazingRange: SetState<boolean>;
};
export const Context = createContext<GlobalContext | undefined>(undefined);
