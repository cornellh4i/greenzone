import React, { useState } from "react";
import Map from "../components/Map";
import TopPanel from "../components/organisms/TopPanel";
import SidePanel from "../components/organisms/SidePanel";
const MonitoringPlatform = () => {

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

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

  const handleProvinceSelect = (provinceName: string) => {
    setSelectedProvince(provinceName);
  };
  console.log(setSelectedProvince);
  // interface for SidePanel
  // fetch coord data for all provinces
  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ height: '35px', padding: '30px', zIndex: 1 }}>
      {/* Top Panel */}
      <TopPanel 
        onProvinceSelect={handleProvinceSelect}
        carryingCapacity={carryingCapacity}
        showBelowCells={showBelowCells}
        showAtCapCells={showAtCapCells}
        showAboveCells={showAboveCells}
        setCarryingCapacity={setCarryingCapacity}
        setShowBelowCells={setShowBelowCells}
        setShowAtCapCells={setShowAtCapCells}
        setShowAboveCells={setShowAboveCells}
        ndviSelect={ndviSelect}
        showPositiveCells={showPositiveCells}
        showZeroCells={showZeroCells}
        showNegativeCells={showNegativeCells}
        setNdviSelect={setNdviSelect}
        setShowPositiveCells={setShowPositiveCells}
        setShowZeroCells={setShowZeroCells}
        setShowNegativeCells={setShowNegativeCells}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        grazingRange={grazingRange}
        setGrazingRange={setGrazingRange}
      />
      </div>
      <div>
        <SidePanel // fetch for specific info
          provinceName={selectedProvince}
          carryingCapacity={carryingCapacity}
          setCarryingCapacity={setCarryingCapacity}
          showBelowCells={showBelowCells}
          setShowBelowCells={setShowBelowCells}
          showAtCapCells={showAtCapCells}
          setShowAtCapCells={setShowAtCapCells}
          showAboveCells={showAboveCells}
          setShowAboveCells={setShowAboveCells}
          ndviSelect={ndviSelect}
          setNdviSelect={setNdviSelect}
          showPositiveCells={showPositiveCells}
          setShowPositiveCells={setShowPositiveCells}
          showZeroCells={showZeroCells}
          setShowZeroCells={setShowZeroCells}
          showNegativeCells={showNegativeCells}
          setShowNegativeCells={setShowNegativeCells}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          grazingRange={grazingRange}
          setGrazingRange={setGrazingRange}
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