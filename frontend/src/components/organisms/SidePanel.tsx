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
import { useTheme, useMediaQuery } from "@mui/material";

interface SidePanelProps {
  yearOptions: string[];
}
const SidePanel: React.FC<SidePanelProps> = ({ yearOptions }) => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    categoryType: LayerType | null
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/${entityType}/${entityID}/${categoryType}/cell-summary`
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
        y:
          livestock_data[
            `number_of_${livestockType.toLowerCase()}` as keyof typeof livestock_data
          ] || 0,
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
      if (selectedProvince) {
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
      }

      // Then load county data if selected
      if (selectedCounty) {
        const [countyStats, countyCellSummary, countyLivestock] =
          await Promise.all([
            loadEntityStats("county", selectedCounty),
            loadEntityCellSummary("county", selectedCounty, selectedLayerType),
            loadEntityLivestock("county", selectedCounty),
          ]);
        setCountyData({ countyStats, countyCellSummary, countyLivestock });
      }
    } catch (error) {
      console.error("Error fetching Entity Data:", error);
    }
  };

  /**** STATE MANAGEMENT ****/
  // When a Province is selected/searched activates and SetPanel Open
  useEffect(() => {
    if (selectedYear && selectedProvince) {
      loadEntityData();
      setIsPanelOpen(true);
    }
  }, [selectedProvince, selectedYear]);

  // When a County is selected/searched activates and SetPanel Open
  useEffect(() => {
    if (selectedYear && selectedCounty && provinceData) {
      loadEntityData();
      setIsPanelOpen(true);
    }
  }, [selectedCounty, selectedProvince, selectedYear]);

  // Controls the Top Panel
  useEffect(() => {
    if (provinceData) {
      setTopPanelOpen(true);
    } else {
      setTopPanelOpen(false);
    }
  }, [provinceData, setTopPanelOpen]);

  /**** EXITING FUNCTIONS ****/
  // Closes the Province SidePanel --> moves to the General SidePanel
  const handleProvinceToMap = () => {
    setProvinceData(null);
    setSelectedProvince(null);
    setCountyData(null);
    setSelectedCounty(null);
    setShowGeneralPanel(false);
  };
  // Closes the County SidePanel --> moves to Province SidePanel
  const handleCountyToProvince = () => {
    setCountyData(null);
    setSelectedCounty(null);
  };
  // Toggles (Open/Close) the SidePanel as a while regardless if its Prov/Count/General
  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setTopPanelOpen(true);
  };

  /**** OPTION/CHANGE VARIABLES ****/
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
      name: LayerType.CarryingCapacity,
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
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            left: isPanelOpen ? "calc(35vw - 24px)" : "-24px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1201,
            transition: "left 0.3s",
            maxLeft: "350px",
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
      )}
      {isMobile && !isPanelOpen && (
          <Box
            sx={{
              position: "fixed",
              bottom: 30,
              right: 16,
              zIndex: 1300,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <IconButton
              onClick={handlePanelToggle}
              sx={{ backgroundColor: "white", borderRadius: 2 }}
            >
              <span role="img" aria-label="settings">⚙️</span>
            </IconButton>
            <IconButton
              sx={{ backgroundColor: "white", borderRadius: 2 }}
            >
              <span role="img" aria-label="help">❓</span>
            </IconButton>
          </Box>
      )}
      <Drawer
        anchor={isMobile ? "bottom" : "left"}
        open={isPanelOpen ?? false}
        onClose={handlePanelToggle}
        variant="persistent"
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "35vw",
            height: isMobile ? "75vh" : "calc(100% - 70px)",
            maxWidth: isMobile ? "100%" : "400px",
            boxSizing: "border-box",
            p: 2,
            paddingTop: "10px",
            display: "flex",
            flexDirection: "column",
            marginTop: isMobile ? 0 : "78px",
            borderTopLeftRadius: isMobile ? "12px" : 0,
            borderTopRightRadius: isMobile ? "12px" : 0,
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
        {isMobile && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <IconButton onClick={handlePanelToggle}>
              <CloseIcon />
            </IconButton>
          </Box> )}
          {!provinceData ? (
            // General panel when no province data exists
            <div>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#111",
                  fontFamily: "Inter, Roboto, sans-serif",
                  mt: 2,
                  mb: 1,
                }}
              >
                Carrying Capacity Early Warning System
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="#111">
                Please select a province or adjust the year slider to view data.
              </Typography>

              <Slide
                name="Year"
                selectedValue={selectedYear}
                onChange={handleYearSlider}
                min={Math.min(...yearOptions.map((year) => parseInt(year)))}
                max={Math.max(...yearOptions.map((year) => parseInt(year)))}
                options={yearOptions}
              />
              <div>
                <h2>Data Layers</h2>
                <RadioButton
                  options={options}
                  selectedOption={
                    selectedLayerType ?? LayerType.CarryingCapacity
                  }
                  // only this long for type casting purposes
                  onChange={(value: string) =>
                    handleOptionChange(value as LayerType)
                  }
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
