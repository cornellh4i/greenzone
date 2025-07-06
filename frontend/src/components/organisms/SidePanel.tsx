import React, { useContext, useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer, Divider, Typography, IconButton } from "@mui/material";
import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/molecules/Slide";
import { LayerType, Context } from "../../utils/global";
import SidePanelPercentageModal from "../molecules/SidePanelPercentageModal";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { backendUrl } from "../../utils/const";
import { useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import {
  buttonStyle,
  LeafIcon,
  ControlIcon,
  MountainIcon,
  WheatIcon,
  UserIcon,
  PersonIcon,
} from "../../utils/const";

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
  const [showGuide, setShowGuide] = useState(false);

  const { t: ts } = useTranslation("sidepanel");

  // You can adjust or refine these colors as needed
  const carryingCapacityColors = ["#3CB371", "#FFA500", "#DC143C"];
  const zScoreColors = ["#3F7F7F", "#00008B", "#800080"];

  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];

  const loadEntityCellSummary = async (
    entityType: string,
    entityID: number,
    categoryType: LayerType | null,
    selectedYear: number
  ) => {
    try {
      const response = await fetch(
        `${backendUrl}/cell/${entityType}/${entityID}/${categoryType}/${selectedYear}`
      );
      console.log(
        `${backendUrl}/cell/${entityType}/${entityID}/${categoryType}/${selectedYear}`
      );
      const response_json = await response.json();
      const percentages = [
        response_json.data[0].cat1 || 0,
        response_json.data[0].cat2 || 0,
        response_json.data[0].cat3 || 0,
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
        `${backendUrl}/${entityType}/${entityID}/${selectedYear}/livestock`
      );
      const response_json = await response.json();
      const livestock_data = {
        number_of_livestock: response_json.data[0].total,
        number_of_cattle: response_json.data[0].cattle,
        number_of_goat: response_json.data[0].goat,
        number_of_sheep: response_json.data[0].sheep,
        number_of_camel: response_json.data[0].camel,
        number_of_horse: response_json.data[0].horse,
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
      const response = await fetch(`${backendUrl}/${entityType}/${entityID}`);
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
            loadEntityCellSummary(
              "county",
              selectedCounty,
              selectedLayerType,
              selectedYear
            ),
            loadEntityLivestock("county", selectedCounty),
          ]);
        setCountyData({ countyStats, countyCellSummary, countyLivestock });
      }
    } catch (error) {
      console.error("Error fetching Entity Data:", error);
    }
  };

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
            <Button
              onClick={() => setShowBelowCells(!showBelowCells)}
              label="Below"
              sx={buttonStyle(showBelowCells, "#008A16")}
              startIcon={<LeafIcon isActive={showBelowCells} color="#008A16" />}
              disabled={!(selectedLayerType == LayerType.CarryingCapacity)}
            />
            <Button
              onClick={() => setShowAtCapCells(!showAtCapCells)}
              label="At Capacity"
              sx={buttonStyle(showAtCapCells, "#A66605")}
              startIcon={<LeafIcon isActive={showAtCapCells} color="#A66605" />}
              disabled={!(selectedLayerType == LayerType.CarryingCapacity)}
            />
            <Button
              onClick={() => setShowAboveCells(!showAboveCells)}
              label="Above"
              sx={buttonStyle(showAboveCells, "#BF0022")}
              startIcon={<LeafIcon isActive={showAboveCells} color="#BF0022" />}
              disabled={!(selectedLayerType == LayerType.CarryingCapacity)}
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
            <Button
              onClick={() => setShowPositiveCells(!showPositiveCells)}
              label="Positive"
              sx={buttonStyle(showPositiveCells, "teal")}
              startIcon={
                <ControlIcon isActive={showPositiveCells} color="teal" />
              }
              disabled={!(selectedLayerType == LayerType.ZScore)}
            />
            <Button
              onClick={() => setShowZeroCells(!showZeroCells)}
              label="Zero"
              sx={buttonStyle(showZeroCells, "darkblue")}
              startIcon={
                <ControlIcon isActive={showZeroCells} color="darkblue" />
              }
              disabled={!(selectedLayerType == LayerType.ZScore)}
            />
            <Button
              onClick={() => setShowNegativeCells(!showNegativeCells)}
              label="Negative"
              sx={buttonStyle(showNegativeCells, "purple")}
              startIcon={
                <ControlIcon isActive={showNegativeCells} color="purple" />
              }
              disabled={!(selectedLayerType == LayerType.ZScore)}
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
      {!isPanelOpen && (
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
            <span role="img" aria-label="settings">
              ⚙️
            </span>
          </IconButton>
          <IconButton
            onClick={() => setShowGuide(true)}
            sx={{ backgroundColor: "white", borderRadius: 2 }}
          >
            <span role="img" aria-label="help">
              ❓
            </span>
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
          zIndex: 1200,
          position: "fixed",
          top: "70px",
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
            </Box>
          )}
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
                {ts("systemTitle")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body2"
                color="#111"
                fontFamily="Poppins, sans-serif"
              >
                {ts("instruction")}
              </Typography>

              <Slide
                name="Year"
                selectedValue={selectedYear}
                onChange={handleYearSlider}
                min={Math.min(...yearOptions.map((year) => parseInt(year)))}
                max={Math.max(...yearOptions.map((year) => parseInt(year)))}
                options={yearOptions}
              />
              <div style={{ fontFamily: "Poppins, sans-serif" }}>
                <h2>{ts("dataLayers")}</h2>
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
            <div style={{ fontFamily: "Poppins, sans-serif" }}>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                {/*<Button onClick={handleProvinceToMap} startIcon={<ArrowBackIosNewIcon />}*/}
                <IconButton
                  onClick={handleProvinceToMap}
                  size="small" // Makes it smaller
                  sx={{
                    padding: "4px",
                    backgroundColor: "transparent",
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
              </div>
              <h1>{provinceData.provinceStats.entityName}</h1>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto 1fr",
                  columnGap: "0px",
                  rowGap: "10px",
                  alignItems: "center",
                }}
              >
                <MountainIcon />
                <span>{provinceData.provinceStats.entityLandArea} km²</span>

                <PersonIcon />
                <span>{provinceData.provinceStats.entityHerders} herders</span>

                <WheatIcon />
                <span>
                  {provinceData.provinceStats.entityGrazingRange}% grazing range
                </span>

                <UserIcon />
                <span>
                  {provinceData.provinceStats.entityCitizens} citizens
                </span>
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
            <div style={{ fontFamily: "Poppins, sans-serif" }}>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <IconButton
                  onClick={handleProvinceToMap}
                  size="small" // Makes it smaller
                  sx={{
                    padding: "4px",
                    backgroundColor: "transparent",
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
              </div>
              <h1>{countyData.countyStats.entityName}</h1>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto 1fr",
                  columnGap: "0px",
                  rowGap: "10px",
                  alignItems: "center",
                }}
              >
                <MountainIcon />
                <span> {countyData.countyStats.entityLandArea} km²</span>

                <PersonIcon />
                <span>{countyData.countyStats.entityHerders} herders</span>

                <WheatIcon />
                <span>
                  {countyData.countyStats.entityGrazingRange}% grazing range
                </span>

                <UserIcon />
                <span>{countyData.countyStats.entityCitizens} citizens</span>
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
      </Drawer>
      {showGuide && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1400,
            bgcolor: "white",
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" },
            maxHeight: "80vh",
            overflowY: "auto",
            "& *": { fontFamily: "Poppins, sans-serif" }, // This applies to all child elements
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Map Guide
            </Typography>
            <IconButton onClick={() => setShowGuide(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body2" paragraph>
            hey there delilah, how is it like in new york city?
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Usage
          </Typography>
          <Typography variant="body2">
            im a thousand miles away, but tonight you look so pretty. <br />
            <strong>yes you do</strong> times square don't shine as bright as
            you, i swear it's true.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default SidePanel;
