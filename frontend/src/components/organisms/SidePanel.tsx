import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider } from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
import Toggle from "@/components/atoms/Toggle";

interface SidePanelProps {
  provinceName: string | null;
  isPanelOpen: boolean | null;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  carryingCapacity: boolean | null;
  setCarryingCapacity: React.Dispatch<React.SetStateAction<boolean>>;
  showBelowCells: boolean | null;
  setShowBelowCells: React.Dispatch<React.SetStateAction<boolean>>;
  showAtCapCells: boolean | null;
  setShowAtCapCells: React.Dispatch<React.SetStateAction<boolean>>;
  showAboveCells: boolean | null;
  setShowAboveCells: React.Dispatch<React.SetStateAction<boolean>>;
  ndviSelect: boolean | null;
  setNdviSelect: React.Dispatch<React.SetStateAction<boolean>>;
  showPositiveCells: boolean | null;
  setShowPositiveCells: React.Dispatch<React.SetStateAction<boolean>>;
  showZeroCells: boolean | null;
  setShowZeroCells: React.Dispatch<React.SetStateAction<boolean>>;
  showNegativeCells: boolean | null;
  setShowNegativeCells: React.Dispatch<React.SetStateAction<boolean>>;
  selectedYear: number | 2014;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  grazingRange: boolean | false;
  setGrazingRange: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: string | "carryingCapacity";
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  yearOptions: string[];
  displayName: string;
}
const SidePanel: React.FC<SidePanelProps> = ({
  provinceName,
  isPanelOpen,
  setIsPanelOpen,
  carryingCapacity,
  setCarryingCapacity,
  showBelowCells,
  setShowBelowCells,
  showAtCapCells,
  setShowAtCapCells,
  showAboveCells,
  setShowAboveCells,
  ndviSelect,
  setNdviSelect,
  showPositiveCells,
  setShowPositiveCells,
  showZeroCells,
  setShowZeroCells,
  showNegativeCells,
  setShowNegativeCells,
  selectedYear,
  setSelectedYear,
  grazingRange,
  setGrazingRange,
  selectedOption,
  setSelectedOption,
  yearOptions,
  displayName,
}) => {
  const [provinceData, setProvinceData] = useState<any | null>(null);

  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];

  // Fetch data for the selected province
  const loadProvinceData = async (
    provinceName: string,
    displayName: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/province/${provinceName.name}`
      );
      const json_object = await response.json();
      console.log(provinceName);

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
        displayName,
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
      loadProvinceData(provinceName, displayName);
    }
  }, [provinceName]);

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
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

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    if (option === "carryingCapacity") {
      setCarryingCapacity(true);
      setNdviSelect(false);
      setShowPositiveCells(false);
      setShowZeroCells(false);
      setShowNegativeCells(false);
      setShowBelowCells(false);
      setShowAtCapCells(false);
      setShowAboveCells(false);
    } else if (option === "zScore") {
      setCarryingCapacity(false);
      setNdviSelect(true);
      setShowBelowCells(false);
      setShowAtCapCells(false);
      setShowAboveCells(false);
      setShowNegativeCells(false);
      setShowPositiveCells(false);
      setShowZeroCells(false);
    }
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
            sx={{ backgroundColor: showBelowCells ? "green" : "grey" }}
          />
          <Button
            onClick={() => setShowAtCapCells(!showAtCapCells)}
            label="At Capacity"
            sx={{ backgroundColor: showAtCapCells ? "#C6BF31" : "grey" }}
          />
          <Button
            onClick={() => setShowAboveCells(!showAboveCells)}
            label="Above"
            sx={{ backgroundColor: showAboveCells ? "red" : "grey" }}
          />
        </div>
      ),
    },
    {
      name: "zScore",
      label: "Z-Score",
      content: (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={() => setShowPositiveCells(!showPositiveCells)}
            label="Positive"
            sx={{ backgroundColor: showPositiveCells ? "teal" : "grey" }}
          />
          <Button
            onClick={() => setShowZeroCells(!showZeroCells)}
            label="Zero"
            sx={{ backgroundColor: showZeroCells ? "darkblue" : "grey" }}
          />
          <Button
            onClick={() => setShowNegativeCells(!showNegativeCells)}
            label="Negative"
            sx={{ backgroundColor: showNegativeCells ? "purple" : "grey" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Toggle SidePanel Button */}
      {/* <Button onClick={handlePanelToggle} label="Toggle SidePanel" /> */}

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
            paddingTop: "20px",
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
                options={yearOptions}
              />
              <h2>Grazing Range</h2>
              <Toggle
                initialChecked={grazingRange}
                onChange={(checked) => setGrazingRange(checked)}
              />
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
