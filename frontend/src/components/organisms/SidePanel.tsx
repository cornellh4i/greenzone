import React, { useContext, useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider } from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
import Toggle from "@/components/atoms/Toggle";
import { Context } from "../../utils/global";

import SidePanelPercentageModal from "../molecules/SidePanelPercentageModal";

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
  //local state for controlling the new Percentage Modal
  const [isPercentageModalOpen, setIsPercentageModalOpen] = useState(false);

  // New state to hold cell summary percentages for the modal
  const [cellSummary, setCellSummary] = useState<number[]>([]);

  // Define color schemes & labels separately for clarity
  const carryingCapacityLabels = [
    "Below Capacity",
    "At Capacity",
    "Over Capacity",
  ];
  const zScoreLabels = ["Positive", "Zero", "Negative"];

  // You can adjust or refine these colors as needed
  const carryingCapacityColors = ["#3CB371", "#FFA500", "#DC143C"];
  const zScoreColors = ["#3F7F7F", "#00008B", "#800080"];

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
  // Example: Fetch cell summary data for the selected province and category type
  const loadProvinceCellSummary = async (
    provinceId: number,
    categoryType: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/${provinceId}/${categoryType}/cell-summary`
      );
      console.log(provinceId);
      const json = await response.json();
      console.log(response);
      const percentages = [
        json.data[0].cat1_percentage,
        json.data[0].cat2_percentage,
        json.data[0].cat3_percentage,
      ];
      console.log("Cell summary data:", json);

      //console.log("Cell summary data:", json.data);
      // Assuming the backend returns an object with a "data" array containing the percentages:
      if (json.data) {
        setCellSummary(percentages);
      } else {
        setCellSummary([]);
      }
    } catch (error) {
      console.error("Error fetching cell summary data:", error);
    }
  };

  //get provinvce by ID
  const getProvinceIdByName = (jsonData: any, provinceName: string) => {
    const province = jsonData.data.find(
      (item: any) => item.province_data.province_name === provinceName
    );
    return province ? province.province_id : null;
  };

  // Extracted async function that fetches province data and then loads the cell summary
  const fetchProvinceDataAndLoadSummary = async (
    selectedProvince: string,
    selectedOption: string
  ) => {
    try {
      const response = await fetch(`http://localhost:8080/api/province`);
      const jsonData = await response.json();
      const prov_id = getProvinceIdByName(jsonData, selectedProvince);
      if (prov_id) {
        await loadProvinceCellSummary(prov_id, selectedOption);
      } else {
        console.error(`Province with name ${selectedProvince} not found.`);
      }
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };
  // Whenever the selected province or option changes, fetch cell summary data
  useEffect(() => {
    if (selectedProvince) {
      // Determine the category type string required by the backend
      const categoryType =
        selectedOption === "carryingCapacity" ? "carrying_capacity" : "z_score";
      fetchProvinceDataAndLoadSummary(selectedProvince, categoryType);
    }
  }, [selectedProvince, selectedOption]);

  useEffect(() => {
    if (provinceData) {
      setTopPanelOpen(true);
    } else {
      setTopPanelOpen(false);
    }
  }, [provinceData, setTopPanelOpen]);

  useEffect(() => {
    if (selectedProvince) {
      if(!isPercentageModalOpen){
        setIsPanelOpen(true);
      }
      else{
        setIsPanelOpen(false)
      }
      //loadProvinceData(selectedProvince, displayName);
    }
  }, [selectedProvince, selectedYear,isPercentageModalOpen, setIsPanelOpen]);
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
              {/* Button to open the new Percentage Modal */}
              <div className="mt-4">
                <Button
                  onClick={() => setIsPercentageModalOpen(true)}
                  label="Show Percentage Modal"
                  sx={{ backgroundColor: "#6C757D" }}
                />
              </div>
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
      {/* Render the Percentage Modal at the bottom of SidePanel */}
      <SidePanelPercentageModal
        isOpen={isPercentageModalOpen}
        onClose={() => setIsPercentageModalOpen(false)}
        // If selectedOption is "carryingCapacity", classificationType is true
        classificationType={selectedOption === "carryingCapacity"}
        classificationValues={cellSummary}
        classificationLabels={
          selectedOption === "carryingCapacity"
            ? carryingCapacityLabels
            : zScoreLabels
        }
        classificationColourScheme={
          selectedOption === "carryingCapacity"
            ? carryingCapacityColors
            : zScoreColors
        }
      />
    </div>
  );
};

export default SidePanel;
