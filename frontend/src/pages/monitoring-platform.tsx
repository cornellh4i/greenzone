import React, { useState } from "react";
import Map from "../components/Map";
import TopPanel from "../components/organisms/TopPanel";
import SidePanel from "../components/organisms/SidePanel";
const MonitoringPlatform = () => {

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Associated with Carrying Capacity
  const [carryingCapacity, setCarryingCapacity]= useState(true);
  const [showBelowCells, setShowBelowCells] = useState(false);
  const [showAtCapCells, setShowAtCapCells] = useState(false);
  const [showAboveCells, setShowAboveCells] = useState(false);

  //Associated with Z-Score NDVI
  const [ndviSelect, setNdviSelect]= useState(false);
  const [showPositiveCells, setShowPositiveCells] = useState(false);
  const [showZeroCells, setShowZeroCells] = useState(false);
  const [showNegativeCells, setShowNegativeCells] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number>(2014);
  const [grazingRange, setGrazingRange] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("carryingCapacity");

  const yearOptions = Array.from({ length: 2014 - 2002 + 1 }, (_, index) => (2002 + index).toString());


  const handleProvinceSelect = (provinceName: string) => {
    setSelectedProvince(provinceName);
  };

  const handleIsPanelOpenChange = (value) => {
    setIsPanelOpen(value);
  };

  const handleCarryingCapacityChange = (value) => {
    setCarryingCapacity(value);
  };

  const handleShowBelowCellsChange = (value) => {
    setShowBelowCells(value);
  };

  const handleShowAtCapCellsChange = (value) => {
    setShowAtCapCells(value);
  };

  const handleShowAboveCellsChange = (value) => {
    setShowAboveCells(value);
  };

  const handleNdviSelectChange = (value) => {
    setNdviSelect(value);
  };

  const handleShowPositiveCellsChange = (value) => {
    setShowPositiveCells(value);
  };

  const handleShowZeroCellsChange = (value) => {
    setShowZeroCells(value);
  };

  const handleShowNegativeCellsChange = (value) => {
    setShowNegativeCells(value);
  };

  const handleSelectedYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleGrazingRangeChange = (value) => {
    setGrazingRange(value);
  };


  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ height: '35px', padding: '30px', zIndex: 1 }}>
      {/* Top Panel */}
      <TopPanel 
        onProvinceSelect={handleProvinceSelect}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={handleIsPanelOpenChange}
        carryingCapacity={carryingCapacity}
        showBelowCells={showBelowCells}
        showAtCapCells={showAtCapCells}
        showAboveCells={showAboveCells}
        setCarryingCapacity={handleCarryingCapacityChange}
        setShowBelowCells={handleShowBelowCellsChange}
        setShowAtCapCells={handleShowAtCapCellsChange}
        setShowAboveCells={handleShowAboveCellsChange}
        ndviSelect={ndviSelect}
        showPositiveCells={showPositiveCells}
        showZeroCells={showZeroCells}
        showNegativeCells={showNegativeCells}
        setNdviSelect={handleNdviSelectChange}
        setShowPositiveCells={handleShowPositiveCellsChange}
        setShowZeroCells={handleShowZeroCellsChange}
        setShowNegativeCells={handleShowNegativeCellsChange}
        selectedYear={selectedYear}
        setSelectedYear={handleSelectedYearChange}
        grazingRange={grazingRange}
        setGrazingRange={handleGrazingRangeChange}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        yearOptions={yearOptions}
      />
      </div>
      <div>
        <SidePanel // fetch for specific info
          provinceName={selectedProvince}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={handleIsPanelOpenChange}
          carryingCapacity={carryingCapacity}
          setCarryingCapacity={handleCarryingCapacityChange}
          showBelowCells={showBelowCells}
          setShowBelowCells={handleShowBelowCellsChange}
          showAtCapCells={showAtCapCells}
          setShowAtCapCells={handleShowAtCapCellsChange}
          showAboveCells={showAboveCells}
          setShowAboveCells={handleShowAboveCellsChange}
          ndviSelect={ndviSelect}
          setNdviSelect={handleNdviSelectChange}
          showPositiveCells={showPositiveCells}
          setShowPositiveCells={handleShowPositiveCellsChange}
          showZeroCells={showZeroCells}
          setShowZeroCells={handleShowZeroCellsChange}
          showNegativeCells={showNegativeCells}
          setShowNegativeCells={handleShowNegativeCellsChange}
          selectedYear={selectedYear}
          setSelectedYear={handleSelectedYearChange}
          grazingRange={grazingRange}
          setGrazingRange={handleGrazingRangeChange}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          yearOptions={yearOptions}
        />
      </div>
        <Map // fetches all coordinates Province/Counties/Cells
          onProvinceSelect={handleProvinceSelect}
          showAboveCells={showAboveCells}
          showAtCapCells={showAtCapCells}
          showBelowCells={showBelowCells}
        />
    </div>
    </>
  );
};

export default MonitoringPlatform;
// Use Case: when a user looks up a sopecifc province
//1. Click - Map --> provinceName as Prop and query that province
//2. Search - Top Panel