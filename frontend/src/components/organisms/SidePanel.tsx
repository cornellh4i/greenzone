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
    selectedCounty,
    setSelectedCounty,

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    displayName,
  } = context;

  const [provinceData,setProvinceData] =useState<any | null>(null);
  const [countyData,setCountyData] =useState<any | null>(null);

  const [counties, setCounties] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
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

  const loadProvinceData = async (provinceId: number) => {
    try {
      const responseData = await fetch(
        `http://localhost:8080/api/province/${provinceId}`
      );
      const responseLivestock = await fetch(
        `http://localhost:8080/api/province/${provinceId}/${selectedYear}`
      );

      const json = await responseData.json();
      const { province_data } = json.data[0];

      const json_object = await responseLivestock.json();
      const selectedData = {
        number_of_livestock: json_object.data[0].yearly_agg.total,
        number_of_cattle: json_object.data[0].yearly_agg.cattle,
        number_of_goat: json_object.data[0].yearly_agg.goat,
        number_of_sheep: json_object.data[0].yearly_agg.sheep,
        number_of_camel: json_object.data[0].yearly_agg.camel,
        number_of_horse: json_object.data[0].yearly_agg.horse,
      };

      const formattedData = livestockTypes.map((livestockType) => ({
        x: livestockType,
        y: selectedData[`number_of_${livestockType.toLowerCase()}`] || 0,
      }));

      setProvinceData({
        selectedYear,
        province_name: province_data.province_name,
        province_herders: province_data.province_herders,
        province_counties: province_data.province_counties,
        province_land_area: province_data.province_land_area,
        province_livestock_data : formattedData,
      });
     
    } catch (error) {
      console.error("Error fetching Province Data", error);
    }
  };

  const loadCountyData = async (countyId: number) => {
    try {
      const responseLivestock = await fetch(
        `http://localhost:8080/api/county/${countyId}/${selectedYear}`
      );
      const responseData = await fetch(
        `http://localhost:8080/api/county/${countyId}`
      );
      
      const json = await responseData.json();
      const { county_data } = json.data[0];

      const json_object = await responseLivestock.json();
      const selectedData = {
        number_of_livestock: json_object.data[0].yearly_agg.total,
        number_of_cattle: json_object.data[0].yearly_agg.cattle,
        number_of_goat: json_object.data[0].yearly_agg.goat,
        number_of_sheep: json_object.data[0].yearly_agg.sheep,
        number_of_camel: json_object.data[0].yearly_agg.camel,
        number_of_horse: json_object.data[0].yearly_agg.horse,
      };

      const formattedData = livestockTypes.map((livestockType) => ({
        x: livestockType,
        y: selectedData[`number_of_${livestockType.toLowerCase()}`] || 0,
      }));

      setCountyData({
        selectedYear,
        sid: county_data.sid,
        soum_name: county_data.soum_name,
        province_name: county_data.province_name,
        county_livestock_data : formattedData,
      });
    } catch (error) {
      console.error("Error fetching County Data", error);
    }
  };


  // Controls the Top Panel
  useEffect(() => {
    if (provinceData) {
      setTopPanelOpen(true);
    } else {
      setTopPanelOpen(false);
    }
  }, [provinceData, setTopPanelOpen]);

  // Controls whether to open up the SidePanel Or NOT
  useEffect(() => {
    if (selectedProvince) {
      setIsPanelOpen(true);
    }
  }, [selectedProvince, setIsPanelOpen]);

  // Controls when to fetch province/county specific summary data
  useEffect(() => {
    if (selectedYear && selectedProvince) {
      const id = selectedProvince;
      loadProvinceCellSummary(id, selectedLayerType);
      loadProvinceData(id)
    }
    
  }, [selectedProvince, selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedCounty ) {
      const id = selectedCounty ;
      loadCountyData(id)
    }
    
  }, [selectedCounty, selectedYear]);
      



// At the top of your file/component:
const INITIAL_BOUNDS: [number, number, number, number] = [87, 41, 119, 52];

// Zoom handling function:
const handleZoom = (bounds: [number, number, number, number]) => {
  if (!map) return; // 'map' comes from your Map instance via useRef/useState
  
  (bounds, {
    padding: 50,
    duration: 1000,
    maxZoom: selectedCounty ? 10 : selectedProvince ? 8 : 5.5,
  });
};

// Get province bounds:
const getProvinceBounds = (provinceId: number | null): [number, number, number, number] => {
  const province = provinces.find((p) => p.ID === provinceId);
  return province?.view || INITIAL_BOUNDS;
};

// Correct back-button logic:
// const handleBack = () => {
//   if (selectedCounty) {
//     // Exiting county -> back to province
//     setSelectedCounty(null);
//     handleZoom(getProvinceBounds(selectedProvince));
//   } else if (selectedProvince) {
//     // Exiting province -> back to entire Mongolia
//     setSelectedProvince(null);
//     handleZoom(INITIAL_BOUNDS);
//   }

//   // Clear province or county data if needed:
//   setProvinceData(null);
// };

const handleProvinceBack = () => {
  setProvinceData(null);
  setSelectedProvince(null);
};

const handleCountyBack = () => {
  setCountyData(null);
  setSelectedCounty(null);
}

//   if (selectedCounty && selectedProvince) {
//     // County -> Province
//     setSelectedCounty(null);
//     const provinceBounds = getProvinceBounds(selectedProvince);
//     if (provinceBounds) {
//       handleZoom(provinceBounds);
//     } else {
//       console.error("Province bounds not found for ID:", selectedProvince);
//       handleZoom(INITIAL_BOUNDS); // fallback zoom
//     }
//   } else if (selectedProvince) {
//     // Province -> Mongolia
//     setSelectedProvince(null);
//     handleZoom(INITIAL_BOUNDS);
//   }

//   // Clear detailed data
//   setLivestockData(null);
// };

  // Controls when to close the SidePanel
  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setTopPanelOpen(true);
    if (!isPanelOpen) {
      setProvinceData(null);
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
          {!countyData ? !provinceData ? (
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
                <Button onClick={handleProvinceBack} label="Back" />
              </div>
              <h1>{provinceData.province_name}</h1>
              <p>
                <strong>Province Land Area:</strong> {provinceData.province_land_area}{" "}
                km²
              </p>
              <p>
                <strong>Total Herders in Province:</strong>{" "}
                {provinceData.province_herders}
              </p>
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
              {provinceData.province_livestock_data.length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: provinceData.province_name,
                      data: provinceData.province_livestock_data,
                    },
                  ]}
                  livestock={livestockTypes}
                />
              )}
              {counties.length > 0 && (
                <div>
                  <h2>Select County</h2>
                  <select
                    value={selectedCounty ?? ""}
                    onChange={(e) => setSelectedCounty(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      Select a county
                    </option>
                    {counties.map((county) => (
                      <option key={county.id} value={county.id}>
                        {county.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ):(
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handleCountyBack} label="Back" />
              </div>
              <h1>{countyData.soum_name}</h1>
              <p>
                <strong>Province Land Area:</strong> {provinceData.province_land_area}{" "}
                km²
              </p>
              <p>
                <strong>Total Herders in Province:</strong>{" "}
                {provinceData.province_herders}
              </p>
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
              {countyData.county_livestock_data.length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: countyData.soum_name,
                      data: countyData.county_livestock_data,
                    },
                  ]}
                  livestock={livestockTypes}
                />
              )}
              {counties.length > 0 && (
                <div>
                  <h2>Select County</h2>
                  <select
                    value={selectedCounty ?? ""}
                    onChange={(e) => setSelectedCounty(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      Select a county
                    </option>
                    {counties.map((county) => (
                      <option key={county.id} value={county.id}>
                        {county.name}
                      </option>
                    ))}
                  </select>
                </div>
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
