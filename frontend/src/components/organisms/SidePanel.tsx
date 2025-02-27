import React, { useContext, useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider } from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
import Toggle from "@/components/atoms/Toggle";
import { Context } from "../../utils/global";

interface SidePanelProps {
  yearOptions: string[];
}
const SidePanel: React.FC<SidePanelProps> = ({ yearOptions }) => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    selectedProvince,
    isPanelOpen,
    setIsPanelOpen,
    setTopPanelOpen,
    setCarryingCapacity,
    showBelowCells,
    setShowBelowCells,
    showAtCapCells,
    setShowAtCapCells,
    showAboveCells,
    setShowAboveCells,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    displayName,
  } = context;

  const [provinceData, setProvinceData] = useState<any | null>(null);

  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];

  // Fetch data for the selected province
  // const loadProvinceData = async (
  //   provinceName: string,
  //   displayName: string
  // ) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/province/21`);
  //     const json_object = await response.json();
  //     console.log(json_object);

  //     const { province_name, province_land_area, province_herders } =
  //       json_object;

  //     const selectedYearData = {
  //       number_of_livestock:
  //         json_object.province_number_of_livestock[selectedYear || 2014],
  //       number_of_cattle:
  //         json_object.province_number_of_cattle[selectedYear || 2014],
  //       number_of_goat:
  //         json_object.province_number_of_goat[selectedYear || 2014],
  //       number_of_sheep:
  //         json_object.province_number_of_sheep[selectedYear || 2014],
  //       number_of_camel:
  //         json_object.province_number_of_camel[selectedYear || 2014],
  //       number_of_horse:
  //         json_object.province_number_of_horse[selectedYear || 2014],
  //     };

  //     const formattedData = livestockTypes.map((livestockType) => ({
  //       x: livestockType,
  //       y: selectedYearData[`number_of_${livestockType.toLowerCase()}`] || 0,
  //     }));

  //     setProvinceData({
  //       displayName,
  //       province_name,
  //       province_land_area,
  //       province_herders,
  //       selectedYear,
  //       formattedData,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching province data:", error);
  //   }
  // };

  useEffect(() => {
    if (provinceData) {
      setTopPanelOpen(true);
    } else {
      setTopPanelOpen(false);
    }
  }, [provinceData, setTopPanelOpen]);

  useEffect(() => {
    if (selectedProvince) {
      setIsPanelOpen(true);
      //loadProvinceData(selectedProvince, displayName);
    }
  }, [selectedProvince, selectedYear, setIsPanelOpen]);

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setTopPanelOpen(true);
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

      <Drawer
        anchor="left"
        open={isPanelOpen ?? false}
        onClose={handlePanelToggle}
        variant="persistent" // Allows interaction with the background
        PaperProps={{
          sx: {
            width: "35vw",
            maxWidth: "400px",
            boxSizing: "border-box",
            p: 2,
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            marginTop: "6.1%", // Ensures the Drawer starts below the TopPanel
          },
        }}
        sx={{
          zIndex: 1200,
          position: "relative",
        }}
      >
        <Box>
          {!provinceData ? (
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handlePanelToggle} label="Close" />
              </div>
              <h1>Carrying Capacity Early Warning System</h1>
              <Divider sx={{ mb: 2 }} />
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
                initialChecked={grazingRange ?? false}
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
