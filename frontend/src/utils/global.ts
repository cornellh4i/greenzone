import { SetStateAction, createContext } from "react";

export type SetState<T> = React.Dispatch<SetStateAction<T>>;
export type GlobalContext = {
  selectedProvince: string | null;
  setSelectedProvince: SetState<string>;
  selectedYear: number;
  setSelectedYear: SetState<number>;
  isPanelOpen: boolean | null;
  setIsPanelOpen: SetState<boolean>;
  isTopPanelOpen: boolean | null;
  setTopPanelOpen: SetState<boolean>;
  searched: string | null;
  setSearched: SetState<string>;
  selectedOption: string | null; //"carryingCapacity"
  setSelectedOption: SetState<string>;
  displayName: string | null;
  setDisplayName: SetState<string>;

  /////////////////////////////////////////
  carryingCapacity: boolean | null;
  setCarryingCapacity: SetState<boolean>;
  showBelowCells: boolean | null;
  setShowBelowCells: SetState<boolean>;
  showAtCapCells: boolean | null;
  setShowAtCapCells: SetState<boolean>;
  showAboveCells: boolean | null;
  setShowAboveCells: SetState<boolean>;
  ndviSelect: boolean | null;
  setNdviSelect: SetState<boolean>;
  showPositiveCells: boolean | null;
  setShowPositiveCells: SetState<boolean>;
  showZeroCells: boolean | null;
  setShowZeroCells: SetState<boolean>;
  showNegativeCells: boolean | null;
  setShowNegativeCells: SetState<boolean>;
  grazingRange: boolean | null;
  setGrazingRange: SetState<boolean>;
};
export const Context = createContext<GlobalContext | undefined>(undefined);
