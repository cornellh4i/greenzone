/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck comment
import React, { useContext, useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider , Typography, Switch} from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
import Toggle from "@/components/atoms/Toggle";
import { LayerType, Context } from "../../utils/global";
import SidePanelPercentageModal from "../molecules/SidePanelPercentageModal";
import AgricultureIcon from '@mui/icons-material/Agriculture'; 

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
    showNegativeCells,
    setShowNegativeCells,
    showZeroCells,
    setShowZeroCells,

    selectedYear,
    setSelectedYear,
    grazingRange,
    setGrazingRange,
    selectedOption,
    setSelectedOption,
    selectedLayerType,
    setSelectedLayerType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    displayName,
  } = context;

  const [provinceData, setProvinceData] = useState<any | null>(null);
  // THESE COLORS AND LABELS NEED TO GO IN GLOBAL
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

  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];
  const loadProvinceCellSummary = async (
    provinceId: number,
    categoryType: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/${provinceId}/${categoryType}/cell-summary`
      );
      const json = await response.json();
      const percentages = [
        json.data[0].cat1_percentage,
        json.data[0].cat2_percentage,
        json.data[0].cat3_percentage,
      ];
      if (json.data) {
        setCellSummary(percentages);
      } else {
        setCellSummary([]);
      }
    } catch (error) {
      console.error("Error fetching cell summary data:", error);
    }
  };

  // Fetch data for the selected province
  const loadProvinceData = async (provinceID: number, displayName: string) => {
    try {
      console.log(selectedYear);
      console.log(provinceID);
      const response = await fetch(
        `http://localhost:8080/api/province/${provinceID}/${selectedYear}`
      );
      const json_object = await response.json();
      console.log(json_object.data[0].yearly_agg.total);

      const { province_name, province_land_area, province_herders } =
        json_object;

      const selectedData = {
        number_of_livestock: json_object.data[0].yearly_agg.total,
        number_of_cattle: json_object.data[0].yearly_agg.cattle,
        number_of_goat: json_object.data[0].yearly_agg.goat,
        number_of_sheep: json_object.data[0].yearly_agg.sheep,
        number_of_camel: json_object.data[0].yearly_agg.camel,
        number_of_horse: json_object.data[0].yearly_agg.horse,
      };
      console.log(selectedData);

      const formattedData = livestockTypes.map((livestockType) => ({
        x: livestockType,
        y: selectedData[`number_of_${livestockType.toLowerCase()}`] || 0,
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
    if (provinceData) {
      setTopPanelOpen(true);
    } else {
      setTopPanelOpen(false);
    }
  }, [provinceData, setTopPanelOpen]);

  useEffect(() => {
    if (selectedProvince) {
      setIsPanelOpen(true);
      const categoryType =
        selectedOption === "carryingCapacity" ? "carrying_capacity" : "z_score"; //NEEDS TO BE ADDRESSED - VARIABLE FIXING
      loadProvinceCellSummary(selectedProvince, categoryType);
      loadProvinceData(selectedProvince, displayName);
    }
  }, [selectedProvince, selectedYear, setIsPanelOpen, selectedOption]);

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

  const handleOptionChange = (option: LayerType) => {
    setSelectedOption(option);
    setSelectedLayerType(option);
    setShowBelowCells(false);
    setShowAtCapCells(false);
    setShowAboveCells(false);
    setShowNegativeCells(false);
    setShowPositiveCells(false);
    setShowZeroCells(false);
  };

  const options = [
    {
      name: LayerType.CarryingCapacity, // Use enum here
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
      name: LayerType.ZScore,
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
                min={2011}
                max={2022}
                options={yearOptions} />
            <div>
                <h2>Data Layers</h2>
                <RadioButton
                  options={options}
                  selectedOption={selectedOption}
                  onChange={handleOptionChange} />
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
              <SidePanelPercentageModal
                isOpen={true}
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
        <Divider sx={{ my: 2 }} />
        {/* Row with icon, heading, and switch */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 0.5 // small margin bottom before the text below
          }}
        >
          <AgricultureIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ mr: 'auto' }} // pushes the switch to the right
          >
            Grazing Range
          </Typography>
          <Switch
            checked={grazingRange ?? false}
            onChange={(e) => setGrazingRange(e.target.checked)}
            sx={{
              // Override track color when on
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#2E7D32', // dark green
              },
              // Override the thumb color when on
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#ffffff', // white thumb
              },
            }}
      
             />
        </Box>

        {/* Descriptive text below */}
        <Typography
          variant="body2"
          color="text.secondary"
        >
          View data only in land categorized as a grazing range.
        </Typography>
      </Drawer>
      
    </div>
  );
};

export default SidePanel;
