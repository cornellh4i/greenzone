import React, { useState, useEffect } from "react";
import Map from "../components/organisms/Map";
import TopPanel from "../components/organisms/TopPanel";
import SidePanel from "../components/organisms/SidePanel";
import { LayerType, Context } from "../utils/global";
const MonitoringPlatform: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isTopPanelOpen, setTopPanelOpen] = useState(false);
  const [searched, setSearched] = useState<number | null>(null);
  const [yearOptions, setYearOptions] = useState<string[]>([]);

  const [selectedLayerType, setSelectedLayerType] = useState(
    LayerType.CarryingCapacity
  );
  const [showGeneralPanel, setShowGeneralPanel] = useState(true);
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
    yearOptions,
    setYearOptions,

    showGeneralPanel,
    setShowGeneralPanel,

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
  
  const loadYearOptions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/cells/years");
      const response_json = await response.json();
      const years = response_json.data.map((year: { year: number }) => year.year.toString());
      setYearOptions(years.sort());
      return;
    } catch (error) {
      console.error("Error fetching year options:", error);
    }
  }

  useEffect(() => {
    loadYearOptions();
  }, []);

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
