/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck comment
import React, { useContext, useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider, Typography, Switch, Chip } from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
import Toggle from "@/components/atoms/Toggle";
import { LayerType, Context } from "../../utils/global";
import SidePanelPercentageModal from "../molecules/SidePanelPercentageModal";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import CloseIcon from "@mui/icons-material/Close";

interface SidePanelProps {
  yearOptions: string[];
  selectedCounty?: number | null;
}
const SidePanel: React.FC<SidePanelProps> = ({ yearOptions }) => {

  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    selectedProvince,
    setSelectedProvince,
    selectedYear,
    setSelectedYear,
    grazingRange,
    setGrazingRange,
    selectedLayerType,
    setSelectedLayerType,

    isPanelOpen,
    setIsPanelOpen,
    setTopPanelOpen,

    showBelowCells,
    setShowBelowCells,
    showAtCapCells,
    setShowAtCapCells,
    showAboveCells,
    setShowAboveCells,

    showPositiveCells,
    setShowPositiveCells,
    showNegativeCells,
    setShowNegativeCells,
    showZeroCells,
    setShowZeroCells,

    selectedCounty: selectedCounty,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    displayName,
  } = context;

  // Log the context value
  console.log("Context selectedCounty:", selectedCounty);

  // Modify your useEffect to use the context value instead of prop
  useEffect(() => {
    if (selectedCounty) {
      setIsPanelOpen(true);
      console.log("Selected county changed, loading data for ID:", selectedCounty);
      loadCountyData(selectedCounty);
    }
  }, [selectedCounty]);


  const [provinceData, setProvinceData] = useState<any | null>(null);


  const [countyData, setCountyData] = useState<any | null>(null);
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
      setCountyData(null);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };


  // Fetch data for the selected province
  // Fetch data for the selected county
  const loadCountyData = async (countyID: number) => {
    console.log("county selected year!:" + selectedYear)
    try {
      // First, get the county metadata to get names
      const metadataResponse = await fetch(`http://localhost:8080/api/county/${countyID}`);
      const metadataJson = await metadataResponse.json();
      const sn = metadataJson.data[0].county_data.soum_name;
      const pn = metadataJson.data[0].county_data.province_name;
      const countyName = sn || "Unknown County";
      const provinceName = pn || "Unknown Province";

      // Then get yearly livestock data
      const response = await fetch(
        `http://localhost:8080/api/county/${countyID}/${selectedYear}`
      );
      const json_object = await response.json();

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

      // Now we can use countyName and provinceName since we defined them above
      setCountyData({
        county_name: countyName,
        province_name: provinceName,
        county_land_area: "N/A",
        county_herders: "N/A",
        selectedYear,
        formattedData,
      });
      setProvinceData(null)
    } catch (error) {
      console.error("Error fetching county data:", error);
    }
  };
  // Controls the Top Panel
  useEffect(() => {
    if (provinceData || countyData) {
      setTopPanelOpen(true);
    } else {
      setTopPanelOpen(false);
    }
  }, [provinceData, countyData, setTopPanelOpen]);

  // Controls whether to open up the SidePanel Or NOT
  useEffect(() => {
    if (selectedProvince) {
      setIsPanelOpen(true);
    }
  }, [selectedProvince, setIsPanelOpen]);

  useEffect(() => {
    if (selectedCounty) {
      setIsPanelOpen(true);
      console.log("Selected county changed, loading data for ID:", selectedCounty);
      loadCountyData(selectedCounty);
    }
  }, [selectedCounty]);

  // Controls when to fetch province/county specific summary data
  useEffect(() => {
    if (selectedYear && selectedProvince) {
      loadProvinceCellSummary(selectedProvince, selectedLayerType);
      loadProvinceData(selectedProvince, displayName);
    }
  }, [selectedProvince, selectedYear]);

  // Controls when to Exit Province/County Summary Mode
  const handleBack = () => {
    setProvinceData(null);
    setCountyData(null);
    setSelectedProvince(null);
  };
  // Controls when to close the SidePanel
  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setTopPanelOpen(true);
    if (!isPanelOpen) {
      setProvinceData(null);
      setCountyData(null);
      setSelectedProvince(null);
    }
  };
  const handleYearSlider = (year: number) => {
    setSelectedYear(year);
  };
  const handleOptionChange = (option: LayerType) => {
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
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label="Below"
              onClick={() => setShowBelowCells((prev) => !prev)}
              onDelete={
                showBelowCells ? () => setShowBelowCells(false) : undefined
              }
              deleteIcon={showBelowCells ? <CloseIcon /> : undefined}
              sx={{
                backgroundColor: showBelowCells ? "green" : "grey",
                color: "#fff",
                borderRadius: "16px",
                fontWeight: "bold",
                // Make the close (delete) icon white
                ".MuiChip-deleteIcon": {
                  color: "#fff",
                },
              }}
            />
            <Chip
              label="At Capacity"
              onClick={() => setShowAtCapCells((prev) => !prev)}
              onDelete={
                showAtCapCells ? () => setShowAtCapCells(false) : undefined
              }
              deleteIcon={showAtCapCells ? <CloseIcon /> : undefined}
              sx={{
                backgroundColor: showAtCapCells ? "#C6BF31" : "grey",
                color: "#fff",
                borderRadius: "16px",
                fontWeight: "bold",
                // Make the close (delete) icon white
                ".MuiChip-deleteIcon": {
                  color: "#fff",
                },
              }}
            />
            <Chip
              label="Above"
              onClick={() => setShowAboveCells((prev) => !prev)}
              onDelete={
                showAboveCells ? () => setShowAboveCells(false) : undefined
              }
              deleteIcon={showAboveCells ? <CloseIcon /> : undefined}
              sx={{
                backgroundColor: showAboveCells ? "red" : "grey",
                color: "#fff",
                borderRadius: "16px",
                fontWeight: "bold",
                // Make the close (delete) icon white
                ".MuiChip-deleteIcon": {
                  color: "#fff",
                },
              }}
            />
          </Box>
        </div>
      ),
    },
    {
      name: LayerType.ZScore,
      label: "Z-Score",
      content: (
        <div style={{ display: "flex", gap: "10px" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label="Positive"
              onClick={() => setShowPositiveCells((prev) => !prev)}
              onDelete={
                showPositiveCells
                  ? () => setShowPositiveCells(false)
                  : undefined
              }
              deleteIcon={showPositiveCells ? <CloseIcon /> : undefined}
              sx={{
                backgroundColor: showPositiveCells ? "teal" : "grey",
                color: "#fff",
                fontWeight: "bold",
                ".MuiChip-deleteIcon": {
                  color: "#fff",
                },
              }}
            />
            <Chip
              label="Zero"
              onClick={() => setShowZeroCells((prev) => !prev)}
              onDelete={
                showZeroCells ? () => setShowZeroCells(false) : undefined
              }
              deleteIcon={showZeroCells ? <CloseIcon /> : undefined}
              sx={{
                backgroundColor: showZeroCells ? "darkblue" : "grey",
                color: "#fff",
                fontWeight: "bold",
                ".MuiChip-deleteIcon": {
                  color: "#fff",
                },
              }}
            />
            <Chip
              label="Negative"
              onClick={() => setShowNegativeCells((prev) => !prev)}
              onDelete={
                showNegativeCells
                  ? () => setShowNegativeCells(false)
                  : undefined
              }
              deleteIcon={showNegativeCells ? <CloseIcon /> : undefined}
              sx={{
                backgroundColor: showNegativeCells ? "purple" : "grey",
                color: "#fff",
                fontWeight: "bold",
                ".MuiChip-deleteIcon": {
                  color: "#fff",
                },
              }}
            />
          </Box>
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
          {!provinceData && !countyData ? (
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handlePanelToggle} label="Close" />
              </div>
              <h1>Carrying Capacity Early Warning System</h1>
              <Divider sx={{ mb: 2 }} />
              <p>
                Please select a province or search for a county to view data.
              </p>
              <Slide
                name="Year"
                selectedValue={selectedYear}
                onChange={handleYearSlider}
                min={2011}
                max={2022}
                options={yearOptions}
              />
              <div>
                <h2>Data Layers</h2>
                <RadioButton
                  options={options}
                  selectedOption={
                    selectedLayerType ?? LayerType.CarryingCapacity
                  }
                  onChange={handleOptionChange}
                />
              </div>
            </div>
          ) : (
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handleBack} label="Back" />
              </div>
              {/*
              <h1>{provinceData.province_name}</h1>
              <p>
                <strong>Land Area:</strong> {provinceData.province_land_area}{" "}
                km²
              </p>
              <p>
                <strong>Number of Herders:</strong>{" "}
                {provinceData.province_herders}
              </p>
          */}
              {provinceData && (
                <>
                  <h1>{provinceData.province_name}</h1>
                  <p>
                    <strong>Land Area:</strong> {provinceData.province_land_area}{" "}
                    km²
                  </p>
                  <p>
                    <strong>Number of Herders:</strong>{" "}
                    {provinceData.province_herders}
                  </p>
                </>
              )}

              {countyData && (
                <>
                  <h1>{countyData.county_name}</h1>
                  <p>
                    <strong>Province:</strong> {countyData.province_name}
                  </p>
                  <p>
                    <strong>Land Area:</strong> {countyData.county_land_area}
                  </p>
                  <p>
                    <strong>Number of Herders:</strong>{" "}
                    {countyData.county_herders}
                  </p>
                </>
              )}

              <SidePanelPercentageModal
                isOpen={true}
                classificationType={selectedLayerType}
                classificationValues={cellSummary}
                classificationLabels={
                  selectedLayerType === LayerType.CarryingCapacity
                    ? carryingCapacityLabels
                    : zScoreLabels
                }
                classificationColourScheme={
                  selectedLayerType === LayerType.CarryingCapacity
                    ? carryingCapacityColors
                    : zScoreColors
                }
              />
              <h2>Livestock Data for {selectedYear}</h2>
              {/*{provinceData.formattedData.length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: provinceData.province_name,
                      data: provinceData.formattedData,
                    },
                  ]}
                  livestock={livestockTypes}
                />
                )}*/}
              {provinceData && provinceData.formattedData && provinceData.formattedData.length > 0 && (
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

              {countyData && countyData.formattedData && countyData.formattedData.length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: countyData.county_name,
                      data: countyData.formattedData,
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
            display: "flex",
            alignItems: "center",
            mb: 0.5, // small margin bottom before the text below
          }}
        >
          <AgricultureIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ mr: "auto" }} // pushes the switch to the right
          >
            Grazing Range
          </Typography>
          <Switch
            checked={grazingRange ?? false}
            onChange={(e) => setGrazingRange(e.target.checked)}
            sx={{
              // Override track color when on
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#2E7D32", // dark green
              },
              // Override the thumb color when on
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#ffffff", // white thumb
              },
            }}
          />
        </Box>

        {/* Descriptive text below */}
        <Typography variant="body2" color="text.secondary">
          View data only in land categorized as a grazing range.
        </Typography>
      </Drawer>
    </div>
  );
};

export default SidePanel;

