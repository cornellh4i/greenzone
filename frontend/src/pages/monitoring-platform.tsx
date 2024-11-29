import React, { useState } from "react";
import Map from "../components/Map";

import SidePanel from "../components/organisms/SidePanel";
const MonitoringPlatform = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showBelowCells, setShowBelowCells] = useState(false);
  const [showAtCapCells, setShowAtCapCells] = useState(false);
  const [showAboveCells, setShowAboveCells] = useState(false);

  const handleProvinceSelect = (provinceName: string) => {
    setSelectedProvince(provinceName);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Map Component */}
      <SidePanel
        provinceName={selectedProvince}
        showBelowCells={showBelowCells}
        setShowBelowCells={setShowBelowCells}
        showAtCapCells={showAtCapCells}
        setShowAtCapCells={setShowAtCapCells}
        showAboveCells={showAboveCells}
        setShowAboveCells={setShowAboveCells}
      />
      <Map
        onProvinceSelect={handleProvinceSelect}
        showAboveCells={showAboveCells}
        showAtCapCells={showAtCapCells}
        showBelowCells={showBelowCells}
      />
    </div>
  );
};

export default MonitoringPlatform;
