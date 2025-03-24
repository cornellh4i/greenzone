/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useContext, useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider, Typography, Switch, Chip } from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
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
    selectedCounty,
    setSelectedCounty,
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    displayName,
  } = context;

  const [provinceData, setProvinceData] = useState<any | null>(null);
  const [countyData, setCountyData] = useState<any | null>(null);

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

  const loadEntityCellSummary = async (
    entityType: string,
    entityID: number,
    categoryType: LayerType | null
  ) => {
    console.log(entityID);
    console.log(entityType);
    console.log(categoryType);
    try {
      const response = await fetch(
        `http://localhost:8080/api/${entityType}/${entityID}/${categoryType}/cell-summary` // !!!!! change the api to include province or county
      );

      const response_json = await response.json();
      const percentages = [
        response_json.data[0].cat1_percentage || 0,
        response_json.data[0].cat2_percentage || 0,
        response_json.data[0].cat3_percentage || 0,
      ];
      if (response_json.data) {
        return percentages;
      } else return [];
    } catch (error) {
      console.error("Error fetching Entity CellSummary:", error);
    }
  };

  const loadEntityLivestock = async (entityType: string, entityID: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/${entityType}/${entityID}/${selectedYear}/livestock`
      );
      const response_json = await response.json();
      const livestock_data = {
        number_of_livestock: response_json.data[0].yearly_agg.total,
        number_of_cattle: response_json.data[0].yearly_agg.cattle,
        number_of_goat: response_json.data[0].yearly_agg.goat,
        number_of_sheep: response_json.data[0].yearly_agg.sheep,
        number_of_camel: response_json.data[0].yearly_agg.camel,
        number_of_horse: response_json.data[0].yearly_agg.horse,
      };
      const formattedData = livestockTypes.map((livestockType) => ({
        x: livestockType,
        y: livestock_data[`number_of_${livestockType.toLowerCase()}`] || 0,
      }));

      if (response_json.data) {
        return formattedData;
      } else return [];
    } catch (error) {
      console.error("Error fetching Entity Livestock:", error);
    }
  };

  const loadEntityStats = async (entityType: string, entityID: number) => {
    try {
      // will be fixed later! for now we fix the values
      const response = await fetch(
        `http://localhost:8080/api/${entityType}/${entityID}`
      );
      const response_json = await response.json();
      console.log(response_json);
      const entityData = {
        entityName:
          response_json.data[0][`${entityType}_data`][
            entityType === "county" ? "soum_name" : "province_name"
          ],
        entityLandArea: "1000",
        entityHerders: "360",
        entityGrazingRange: "300",
      };
      return entityData;
    } catch (error) {
      console.error("Error fetching Entity Statistics:", error);
    }
  };

  const loadEntityData = async () => {
    try {
      if (selectedCounty) {
        // if a county is selected- MAKE SURE Province first then county
        const [countyStats, countyCellSummary, countyLivestock] =
          await Promise.all([
            loadEntityStats("county", selectedCounty),
            loadEntityCellSummary("county", selectedCounty, selectedLayerType),
            loadEntityLivestock("county", selectedCounty),
          ]);
        setCountyData({
          countyStats,
          countyCellSummary,
          countyLivestock,
        });
      } else if (selectedProvince) {
        const [provinceStats, provinceCellSummary, provinceLivestock] =
          await Promise.all([
            loadEntityStats("province", selectedProvince),
            loadEntityCellSummary(
              "province",
              selectedProvince,
              selectedLayerType
            ),
            loadEntityLivestock("province", selectedProvince),
          ]);
        setProvinceData({
          provinceStats,
          provinceCellSummary,
          provinceLivestock,
        });
      } else {
        return;
      }
    } catch (error) {
      console.error("Error fetching Entity Data:", error);
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
    console.log("AHHHHHHH");
    if (selectedProvince || selectedCounty) {
      setIsPanelOpen(true);
    }
  }, [selectedProvince, selectedCounty, setIsPanelOpen]);

  // Controls when to fetch province/county specific summary data
  useEffect(() => {
    console.log(provinceData);
    if (selectedYear && selectedProvince) {
      loadEntityData();
    }
  }, [selectedProvince, selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedCounty) {
      loadEntityData();
    }
  }, [selectedCounty, selectedYear]);

  // Controls when to Exit Province/County Summary Mode
  const handleProvinceToMap = () => {
    setProvinceData(null);
    setSelectedProvince(null);
    setCountyData(null);
    setSelectedCounty(null);
  };
  const handleCountyToProvince = () => {
    setCountyData(null);
    setSelectedCounty(null);
  };
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
  console.log(selectedProvince);

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
          {!selectedProvince ? (
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
                <Button
                  onClick={
                    selectedCounty
                      ? handleCountyToProvince
                      : handleProvinceToMap
                  }
                  label="Back"
                />
              </div>
              <h1> NAME </h1>
              <h1>
                {selectedCounty
                  ? countyData.countyStats.entityName
                  : provinceData.provinceStats.entityName}
              </h1>
              <p>
                {selectedCounty
                  ? countyData.countyStats.entityLandArea
                  : provinceData.provinceStats.entityLandArea}{" "}
                <strong>km²</strong> &emsp;
                {selectedCounty
                  ? countyData.countyStats.entityHerders
                  : provinceData.provinceStats.entityHerders}{" "}
                <strong> herders </strong>
                {selectedCounty
                  ? countyData.countyStats.entityGrazingRange
                  : provinceData.provinceStats.entityGrazingRange}{" "}
                <strong>% grazing range</strong>
                {selectedCounty
                  ? countyData.countyStats.entityCitzens
                  : provinceData.provinceStats.entityCitizens}{" "}
                <strong>citizens</strong> &emsp;
              </p>

              <SidePanelPercentageModal
                isOpen={true}
                classificationType={selectedLayerType}
                classificationValues={
                  selectedCounty
                    ? countyData.countyCellSummary
                    : provinceData.provinceCellSummary
                }
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
              <Divider sx={{ my: 2 }} />
              {(selectedCounty
                ? countyData.formattedData
                : provinceData.formattedData
              ).length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: selectedCounty
                        ? countyData.county_name
                        : provinceData.province_name,
                      data: selectedCounty
                        ? countyData.formattedData
                        : provinceData.formattedData,
                    },
                  ]}
                  livestock={livestockTypes}
                  orientation={false}
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
