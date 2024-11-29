import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider } from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/atoms/Slide";
import Toggle from "@/components/atoms/Toggle";

interface SidePanelProps {
  provinceName: string | null;
  showBelowCells: boolean | null;
  setShowBelowCells: React.Dispatch<React.SetStateAction<boolean>>;
  showAtCapCells: boolean | null;
  setShowAtCapCells: React.Dispatch<React.SetStateAction<boolean>>;
  showAboveCells: boolean | null;
  setShowAboveCells: React.Dispatch<React.SetStateAction<boolean>>;
}
const SidePanel: React.FC<SidePanelProps> = ({
  provinceName,
  showBelowCells,
  setShowBelowCells,
  showAtCapCells,
  setShowAtCapCells,
  showAboveCells,
  setShowAboveCells,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2014);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [provinceData, setProvinceData] = useState<any | null>(null);

  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Fetch data for the selected province
  const loadProvinceData = async (provinceName: string) => {
    try {
      console.log(provinceName.name);
      const response = await fetch(
        `http://localhost:8080/api/province/${provinceName.name}`
      );
      const json_object = await response.json();

      const { province_name, province_land_area, province_herders } =
        json_object;

      const selectedYearData = {
        number_of_livestock:
          json_object.province_number_of_livestock[selectedYear || 2014],
        number_of_cattle:
          json_object.province_number_of_cattle[selectedYear || 2014],
        number_of_goat:
          json_object.province_number_of_goat[selectedYear || 2014],
        number_of_sheep:
          json_object.province_number_of_sheep[selectedYear || 2014],
        number_of_camel:
          json_object.province_number_of_camel[selectedYear || 2014],
        number_of_horse:
          json_object.province_number_of_horse[selectedYear || 2014],
      };

      const formattedData = livestockTypes.map((livestockType) => ({
        x: livestockType,
        y: selectedYearData[`number_of_${livestockType.toLowerCase()}`] || 0,
      }));

      setProvinceData({
        province_name,
        province_land_area,
        province_herders,
        selectedYear,
        formattedData,
      });
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  useEffect(() => {
    if (provinceName) {
      setIsPanelOpen(true); // Open the panel when a province is selected
      loadProvinceData(provinceName);
    }
  }, [provinceName]);

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    // setSelectedYear(2014);
    if (!isPanelOpen) {
      setProvinceData(null); // Clear province data when closing the panel
    }
  };

  const handleYearSlider = (year: number) => {
    setSelectedYear(year);
  };
  const handleBack = () => {
    setProvinceData(null);
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const options = [
    {
      name: "carryingCapacity",
      label: "Carrying Capacity",
      content: (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={() => setShowBelowCells(!showBelowCells)}
            label="Below"
          />
          <Button
            onClick={() => setShowAtCapCells(!showAtCapCells)}
            label="At Capacity"
          />
          <Button
            onClick={() => setShowAboveCells(!showAboveCells)}
            label="Above"
          />
        </div>
      ),
    },
    {
      name: "zScore",
      label: "Z-Score",
      content: (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => {}} label="Positive" />
          <Button onClick={() => {}} label="Zero" />
          <Button onClick={() => {}} label="Negative" />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Toggle SidePanel Button */}
      <Button onClick={handlePanelToggle} label="Toggle SidePanel" />

      {/* Persistent Drawer */}
      <Drawer
        anchor="left"
        open={isPanelOpen}
        onClose={handlePanelToggle}
        variant="persistent" // Allows interaction with background
        PaperProps={{
          sx: {
            width: "25vw",
            maxWidth: "400px",
            boxSizing: "border-box",
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box>
          <h2>SidePanel</h2>
          <Divider sx={{ mb: 2 }} />

          {!provinceData ? (
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handlePanelToggle} label="Close" />
              </div>
              <h1>Carrying Capacity Early Warning System</h1>
              <p>
                Please select a province or adjust the year slider to view data.
              </p>
              <Slide
                name="Year"
                selectedValue={selectedYear}
                onChange={handleYearSlider}
                min={2002}
                max={2014}
              />
              <h2>Grazing Range</h2>
              <Toggle initialChecked={false} onChange={() => {}} />
              <h2>Data Layers</h2>
              <RadioButton
                options={options}
                selectedOption={selectedOption}
                onChange={handleOptionChange}
              />
            </div>
          ) : (
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handleBack} label="Back" />
              </div>
              <h1>{provinceData.province_name}</h1>
              <p>
                <strong>Land Area:</strong> {provinceData.province_land_area}{" "}
                km²
              </p>
              <p>
                <strong>Number of Herders:</strong>{" "}
                {provinceData.province_herders}
              </p>
              <h2>Livestock Data for {selectedYear}</h2>
              {provinceData.formattedData.length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: provinceData.province_name,
                      data: provinceData.formattedData,
                    },
                  ]}
                  livestock={livestockTypes}
                />
              )}
            </div>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default SidePanel;
