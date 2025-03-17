import React, { useState } from "react";
import Map from "../components/Map";
import TopPanel from "../components/organisms/TopPanel";
import SidePanel from "../components/organisms/SidePanel";
import { LayerType, Context } from "../utils/global";
const MonitoringPlatform: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isTopPanelOpen, setTopPanelOpen] = useState(false);
  const [searched, setSearched] = useState<string | null>(null);

  const [selectedLayerType, setSelectedLayerType] = useState(
    LayerType.CarryingCapacity
  );
  // Associated with Carrying Capacity

  const [showBelowCells, setShowBelowCells] = useState(false);
  const [showAtCapCells, setShowAtCapCells] = useState(false);
  const [showAboveCells, setShowAboveCells] = useState(false);
  //Associated with Z-Score NDVI

  const [showNegativeCells, setShowNegativeCells] = useState(false);
  const [showPositiveCells, setShowPositiveCells] = useState(false);
  const [showZeroCells, setShowZeroCells] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number>(2014);
  const [grazingRange, setGrazingRange] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<string>("carryingCapacity");
  const [displayName, setDisplayName] = useState<string>("");
  const [isGrazingRangeSelected, setIsGrazingRangeSelected] = useState(false); // Define the variable

  const contextDict = {
    // Province & Selection
    selectedProvince,
    setSelectedProvince,
    selectedCounty,
    setSelectedCounty,
    isPanelOpen,
    setIsPanelOpen,
    isTopPanelOpen,
    setTopPanelOpen,
    searched,
    setSearched,

    selectedLayerType,
    setSelectedLayerType,
    // Carrying Capacity Related

    showBelowCells,
    setShowBelowCells,
    showAtCapCells,
    setShowAtCapCells,
    showAboveCells,
    setShowAboveCells,
    // Z-Score NDVI Related

    showNegativeCells,
    setShowNegativeCells,
    showPositiveCells,
    setShowPositiveCells,
    showZeroCells,
    setShowZeroCells,
    // Other
    selectedYear,
    setSelectedYear,
    grazingRange,
    setGrazingRange,
    selectedOption,
    setSelectedOption,
    displayName,
    setDisplayName,
  };
  const yearOptions = Array.from({ length: 2014 - 2002 + 1 }, (_, index) =>
    (2002 + index).toString()
  );
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div>
          <Context.Provider value={contextDict}>
            <TopPanel yearOptions={yearOptions} />
          </Context.Provider>
        </div>
        <div>
          <Context.Provider value={contextDict}>
            <SidePanel yearOptions={yearOptions} />
          </Context.Provider>
        </div>
        <Context.Provider value={contextDict}>
          <Map />
        </Context.Provider>
      </div>
    </>
  );
};
export default MonitoringPlatform;
// Use Case: when a user looks up a sopecifc province
//1. Click - Map --> provinceName as Prop and query that province
//2. Search - Top Panel
