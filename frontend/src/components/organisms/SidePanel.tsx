/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useContext, useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import {
  Box,
  Drawer,
  Divider,
  Typography,
  Switch,
  Chip,
  IconButton,
} from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
import { LayerType, Context } from "../../utils/global";
import SidePanelPercentageModal from "../molecules/SidePanelPercentageModal";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ClassificationSummary {
  totalCells: number;
  cat1Percentage: number;
  cat2Percentage: number;
  cat3Percentage: number;
}

interface SidePanelProps {
  yearOptions: string[];
  selectedYear: number;
}

const SidePanel: React.FC<SidePanelProps> = ({ yearOptions, selectedYear }) => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    selectedProvince,
    setSelectedProvince,
    selectedCounty,
    setSelectedCounty,
    setSelectedYear,
    grazingRange,
    setGrazingRange,
    selectedLayerType,
    setSelectedLayerType,

    showGeneralPanel,
    setShowGeneralPanel,

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
    categoryType: LayerType | null,
    classificationYear: number
  ): Promise<ClassificationSummary | null> => {
    try {
      const endpoint = entityType === "province"
        ? `/api/province/${entityID}/cell-summary`
        : `/api/county/${entityID}/cell-summary`;

      const response = await fetch(
        `${endpoint}?classificationType=${categoryType?.toLowerCase()}&year=${classificationYear}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        totalCells: data.total_cells,
        cat1Percentage: data.cat1_percentage,
        cat2Percentage: data.cat2_percentage,
        cat3Percentage: data.cat3_percentage,
      };
    } catch (error) {
      console.error('Error loading cell summary:', error);
      return null;
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
      // Always load province data first if needed
      if (selectedProvince && !provinceData) {
        const [provinceStats, provinceCellSummary, provinceLivestock] =
          await Promise.all([
            loadEntityStats("province", selectedProvince),
            loadEntityCellSummary(
              "province",
              selectedProvince,
              selectedLayerType,
              selectedYear
            ),
            loadEntityLivestock("province", selectedProvince),
          ]);
        setProvinceData({
          provinceStats,
          provinceCellSummary,
          provinceLivestock,
        });
      }

      // Then load county data if selected
      if (selectedCounty) {
        const [countyStats, countyCellSummary, countyLivestock] =
          await Promise.all([
            loadEntityStats("county", selectedCounty),
            loadEntityCellSummary("county", selectedCounty, selectedLayerType, selectedYear),
            loadEntityLivestock("county", selectedCounty),
          ]);
        setCountyData({ countyStats, countyCellSummary, countyLivestock });
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

  // Controls when to fetch province/county specific summary data
  useEffect(() => {
    if (selectedYear && selectedProvince) {
      loadEntityData();
      setIsPanelOpen(true);
    }
  }, [selectedProvince, selectedYear]);
  useEffect(() => {
    if (selectedYear && selectedCounty && provinceData) {
      loadEntityData();
      setIsPanelOpen(true);
    }
  }, [selectedCounty, selectedYear]);

  // Controls when to Exit Province/County Summary Mode
  const handleProvinceToMap = () => {
    setProvinceData(null);
    setSelectedProvince(null);
    setCountyData(null);
    setSelectedCounty(null);
    setShowGeneralPanel(false);
  };
  const handleCountyToProvince = () => {
    setCountyData(null);
    setSelectedCounty(null);
  };
  // Controls when to close the SidePanel
  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setTopPanelOpen(true);
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
      <Box
        sx={{
          position: "fixed",
          left: isPanelOpen ? "calc(35vw - 24px)" : "-24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1201,
          transition: "left 0.3s",
          maxLeft: "376px", // 400px - 24px
        }}
      >
        <IconButton
          onClick={handlePanelToggle}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "0 4px 4px 0",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {isPanelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Drawer
        anchor="left"
        open={isPanelOpen ?? false}
        onClose={handlePanelToggle}
        variant="persistent"
        PaperProps={{
          sx: {
            width: "35vw",
            maxWidth: "400px",
            boxSizing: "border-box",
            p: 2,
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            marginTop: "70px", // Match top panel height
            height: "calc(100% - 70px)", // Prevent bottom overflow
          },
        }}
        sx={{
          zIndex: 1200, // Lower than top panel
          position: "fixed",
          top: "70px", // Start below top panel
          left: 0,
          bottom: 0,
        }}
      >
        <Box>
          {!provinceData ? (
            // General panel when no province data exists
            <div>
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
          ) : provinceData && !countyData ? (
            // Province details panel
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handleProvinceToMap} label="Back" />
              </div>
              <h1>{provinceData.provinceStats.entityName}</h1>
              <p>
                {provinceData.provinceStats.entityLandArea} <strong>km²</strong>{" "}
                &emsp;
                {provinceData.provinceStats.entityHerders}{" "}
                <strong>herders</strong> &emsp;
                {provinceData.provinceStats.entityGrazingRange}{" "}
                <strong>% grazing range</strong> &emsp;
                {provinceData.provinceStats.entityCitizens}{" "}
                <strong>citizens</strong>
              </p>
              <SidePanelPercentageModal
                isOpen={true}
                classificationType={selectedLayerType}
                classificationValues={provinceData.provinceCellSummary}
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
              {provinceData.provinceLivestock?.length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: provinceData.province_name,
                      data: provinceData.provinceLivestock,
                    },
                  ]}
                  livestock={livestockTypes}
                  orientation={false}
                />
              )}
            </div>
          ) : (
            // County details panel
            <div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handleCountyToProvince} label="Back" />
              </div>
              <h1>{countyData.countyStats.entityName}</h1>
              <p>
                {countyData.countyStats.entityLandArea} <strong>km²</strong>{" "}
                &emsp;
                {countyData.countyStats.entityHerders} <strong>herders</strong>{" "}
                &emsp;
                {countyData.countyStats.entityGrazingRange}{" "}
                <strong>% grazing range</strong> &emsp;
                {countyData.countyStats.entityCitizens}{" "}
                <strong>citizens</strong>
              </p>
              <SidePanelPercentageModal
                isOpen={true}
                classificationType={selectedLayerType}
                classificationValues={countyData.countyCellSummary}
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
              {countyData.countyLivestock?.length > 0 && (
                <BarChart
                  datasets={[
                    {
                      aimag: countyData.county_name,
                      data: countyData.countyLivestock,
                    },
                  ]}
                  livestock={livestockTypes}
                  orientation={false}
                />
              )}
            </div>
          )}
        </Box>

        {/* Rest of the drawer content */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          <AgricultureIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" sx={{ mr: "auto" }}>
            Grazing Range
          </Typography>
          <Switch
            checked={grazingRange ?? false}
            onChange={(e) => setGrazingRange(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#2E7D32",
              },
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#ffffff",
              },
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          View data only in land categorized as a grazing range.
        </Typography>
      </Drawer>
    </div>
  );
};

export default SidePanel;
