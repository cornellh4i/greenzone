import React, { useState } from "react";
import Map from "../components/Map";
import TopPanel from "../components/organisms/TopPanel";
import SidePanel from "../components/organisms/SidePanel";
import { Context } from "../utils/global";

const MonitoringPlatform: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isTopPanelOpen, setTopPanelOpen] = useState(false);
  const [searched, setSearched] = useState<string | null>(null);

  // Associated with Carrying Capacity
  const [carryingCapacity, setCarryingCapacity] = useState(true);
  const [showBelowCells, setShowBelowCells] = useState(false);
  const [showAtCapCells, setShowAtCapCells] = useState(false);
  const [showAboveCells, setShowAboveCells] = useState(false);

  //Associated with Z-Score NDVI
  const [ndviSelect, setNdviSelect] = useState(false);
  const [showPositiveCells, setShowPositiveCells] = useState(false);
  const [showZeroCells, setShowZeroCells] = useState(false);
  const [showNegativeCells, setShowNegativeCells] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number>(2014);
  const [grazingRange, setGrazingRange] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<string>("carryingCapacity");
  const [displayName, setDisplayName] = useState<string>("");
  const contextDict = {
    // Province & Selection
    selectedProvince,
    setSelectedProvince,
    isPanelOpen,
    setIsPanelOpen,
    isTopPanelOpen,
    setTopPanelOpen,
    searched,
    setSearched,

    // Carrying Capacity Related
    carryingCapacity,
    setCarryingCapacity,
    showBelowCells,
    setShowBelowCells,
    showAtCapCells,
    setShowAtCapCells,
    showAboveCells,
    setShowAboveCells,

    // Z-Score NDVI Related
    ndviSelect,
    setNdviSelect,
    showPositiveCells,
    setShowPositiveCells,
    showZeroCells,
    setShowZeroCells,
    showNegativeCells,
    setShowNegativeCells,

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
  console.log("In the map selecteProvince is " + selectedProvince);
  const yearOptions = Array.from({ length: 2014 - 2002 + 1 }, (_, index) =>
    (2002 + index).toString()
  );

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div style={{ height: "35px", padding: "30px", zIndex: 1 }}>
          {/* Top Panel */}
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
