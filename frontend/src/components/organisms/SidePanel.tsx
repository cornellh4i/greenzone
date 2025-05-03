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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
  const [showGuide, setShowGuide] = useState(false);

  // You can adjust or refine these colors as needed
  const carryingCapacityColors = ["#3CB371", "#FFA500", "#DC143C"];
  const zScoreColors = ["#3F7F7F", "#00008B", "#800080"];

  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];

  const MountainIcon = () => (
    <svg style={{ marginRight: "5px" }} width="15" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.1328 5.17188C16.7083 5.17188 17.2602 4.94326 17.6672 4.53632C18.0741 4.12938 18.3027 3.57745 18.3027 3.00195C18.3027 2.42645 18.0741 1.87453 17.6672 1.46759C17.2602 1.06065 16.7083 0.832031 16.1328 0.832031C15.5573 0.832031 15.0054 1.06065 14.5984 1.46759C14.1915 1.87453 13.9629 2.42645 13.9629 3.00195C13.9629 3.57745 14.1915 4.12938 14.5984 4.53632C15.0054 4.94326 15.5573 5.17188 16.1328 5.17188ZM2.45959 14.7195H11.2803H13.3146H16.6455C17.5622 14.7195 18.3027 13.9763 18.3027 13.0623C18.3027 12.7585 18.2186 12.4601 18.0613 12.1997L14.481 6.33278C14.3698 6.15105 14.1745 6.03984 13.9629 6.03984C13.7513 6.03984 13.556 6.15105 13.4448 6.33007L12.1374 8.47287L8.72253 3.02908C8.54351 2.74156 8.22616 2.56797 7.88711 2.56797C7.54806 2.56797 7.23342 2.74156 7.05169 3.02908L1.17663 12.3977C1.02473 12.6391 0.943359 12.9185 0.943359 13.2033C0.943359 14.0414 1.62146 14.7195 2.45959 14.7195Z" fill="black" />
    </svg>
  );

  const PersonIcon = () => (
    <svg style={{ marginRight: "0px" }} width="15" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_7771_29073)">
        <path d="M3.33857 2.13227C3.33857 1.7869 3.47577 1.45569 3.71997 1.21148C3.96418 0.967272 4.2954 0.830078 4.64076 0.830078C4.98612 0.830078 5.31734 0.967272 5.56155 1.21148C5.80575 1.45569 5.94295 1.7869 5.94295 2.13227C5.94295 2.47763 5.80575 2.80884 5.56155 3.05305C5.31734 3.29726 4.98612 3.43445 4.64076 3.43445C4.2954 3.43445 3.96418 3.29726 3.71997 3.05305C3.47577 2.80884 3.33857 2.47763 3.33857 2.13227ZM4.42373 10.3795V13.852C4.42373 14.3321 4.03579 14.7201 3.5556 14.7201C3.07542 14.7201 2.68748 14.3321 2.68748 13.852V7.79949L1.91159 9.09083C1.66472 9.50048 1.13028 9.63341 0.720633 9.38654C0.310987 9.13966 0.178055 8.60522 0.424928 8.19558L2.00654 5.56407C2.47859 4.78005 3.32501 4.29987 4.23925 4.29987H5.04498C5.95922 4.29987 6.80565 4.78005 7.27769 5.56407L8.8593 8.19558C9.10618 8.60522 8.97325 9.13966 8.5636 9.38654C8.15395 9.63341 7.61951 9.50048 7.37264 9.09083L6.59404 7.79949V13.852C6.59404 14.3321 6.2061 14.7201 5.72592 14.7201C5.24573 14.7201 4.85779 14.3321 4.85779 13.852V10.3795H4.42373Z" fill="black" />
      </g>
      <defs>
        <clipPath id="clip0_7771_29073">
          <rect width="8.68125" height="13.89" fill="white" transform="translate(0.302734 0.830078)" />
        </clipPath>
      </defs>
    </svg>
  );

  const UserIcon = () => (
    <svg style={{ marginRight: "2px" }} width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_7771_29078)">
        <path d="M4.84992 0.830078C5.42552 0.830078 5.97755 1.05874 6.38456 1.46575C6.79158 1.87276 7.02023 2.42479 7.02023 3.00039C7.02023 3.57599 6.79158 4.12802 6.38456 4.53503C5.97755 4.94205 5.42552 5.1707 4.84992 5.1707C4.27432 5.1707 3.72229 4.94205 3.31528 4.53503C2.90827 4.12802 2.67961 3.57599 2.67961 3.00039C2.67961 2.42479 2.90827 1.87276 3.31528 1.46575C3.72229 1.05874 4.27432 0.830078 4.84992 0.830078ZM14.8334 0.830078C15.409 0.830078 15.961 1.05874 16.368 1.46575C16.775 1.87276 17.0037 2.42479 17.0037 3.00039C17.0037 3.57599 16.775 4.12802 16.368 4.53503C15.961 4.94205 15.409 5.1707 14.8334 5.1707C14.2578 5.1707 13.7057 4.94205 13.2987 4.53503C12.8917 4.12802 12.663 3.57599 12.663 3.00039C12.663 2.42479 12.8917 1.87276 13.2987 1.46575C13.7057 1.05874 14.2578 0.830078 14.8334 0.830078ZM0.943359 8.93348C0.943359 7.33559 2.24012 6.03883 3.83801 6.03883H4.99642C5.42777 6.03883 5.83741 6.13378 6.20637 6.30198C6.1711 6.49731 6.15482 6.70077 6.15482 6.90695C6.15482 7.94328 6.61059 8.8738 7.3295 9.51133C7.32408 9.51133 7.31865 9.51133 7.31051 9.51133H1.52121C1.2038 9.51133 0.943359 9.25089 0.943359 8.93348ZM11.9387 9.51133C11.9333 9.51133 11.9279 9.51133 11.9197 9.51133C12.6413 8.8738 13.0944 7.94328 13.0944 6.90695C13.0944 6.70077 13.0754 6.50002 13.0429 6.30198C13.4118 6.13107 13.8215 6.03883 14.2528 6.03883H15.4112C17.0091 6.03883 18.3059 7.33559 18.3059 8.93348C18.3059 9.2536 18.0454 9.51133 17.728 9.51133H11.9414H11.9387ZM7.02023 6.90695C7.02023 6.21623 7.29462 5.5538 7.78304 5.06538C8.27145 4.57697 8.93389 4.30258 9.62461 4.30258C10.3153 4.30258 10.9778 4.57697 11.4662 5.06538C11.9546 5.5538 12.229 6.21623 12.229 6.90695C12.229 7.59768 11.9546 8.26011 11.4662 8.74852C10.9778 9.23694 10.3153 9.51133 9.62461 9.51133C8.93389 9.51133 8.27145 9.23694 7.78304 8.74852C7.29462 8.26011 7.02023 7.59768 7.02023 6.90695ZM4.41586 13.9957C4.41586 11.999 6.03545 10.3795 8.03214 10.3795H11.2144C13.2138 10.3795 14.8334 11.999 14.8334 13.9957C14.8334 14.3945 14.5105 14.7201 14.109 14.7201H5.13749C4.73869 14.7201 4.41315 14.3972 4.41315 13.9957H4.41586Z" fill="black" />
      </g>
      <defs>
        <clipPath id="clip0_7771_29078">
          <rect width="17.3625" height="13.89" fill="white" transform="translate(0.943359 0.830078)" />
        </clipPath>
      </defs>
    </svg>
  );

  const WheatIcon = () => (
    <svg style={{ marginRight: "4px" }} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_7771_29082)">
        <path d="M14.006 1.93998C14.261 1.68497 14.261 1.27262 14.006 1.02032C13.751 0.768022 13.3386 0.76531 13.0863 1.02032L10.6963 3.40494C10.4413 3.65995 10.4413 4.0723 10.6963 4.3246C10.9513 4.5769 11.3636 4.57961 11.6159 4.3246L14.0033 1.93727L14.006 1.93998ZM8.59379 1.56832C8.4256 1.40012 8.14888 1.40012 7.98068 1.56832L7.67142 1.87488C6.65409 2.8922 6.65409 4.54163 7.67142 5.55896L7.95355 5.8411L7.12613 6.66852C7.03389 5.92791 6.70563 5.209 6.13593 4.63929L5.82937 4.33274C5.66118 4.16454 5.38446 4.16454 5.21626 4.33274L4.90971 4.63929C3.89238 5.65662 3.89238 7.30605 4.90971 8.32338L5.19185 8.60552L4.36442 9.43294C4.27218 8.69233 3.94393 7.97342 3.37422 7.40371L3.06767 7.09444C2.89947 6.92625 2.62276 6.92625 2.45456 7.09444L2.148 7.401C1.13068 8.41833 1.13068 10.0678 2.148 11.0851L2.43014 11.3672L0.560973 13.2364C0.221863 13.5755 0.221863 14.1262 0.560973 14.4653C0.900082 14.8044 1.4508 14.8044 1.7899 14.4653L3.65908 12.5962L3.99005 12.9271C5.00737 13.9445 6.6568 13.9445 7.67413 12.9271L7.98068 12.6206C8.14888 12.4524 8.14888 12.1757 7.98068 12.0075L7.67413 11.7009C7.08272 11.1095 6.32854 10.7758 5.55537 10.6999L6.42078 9.83445L6.75175 10.1654C7.76908 11.1827 9.41851 11.1827 10.4358 10.1654L10.7424 9.85886C10.9106 9.69066 10.9106 9.41395 10.7424 9.24575L10.4358 8.9392C9.84443 8.34779 9.09025 8.01411 8.31708 7.93815L9.18249 7.07274L9.51346 7.40371C10.5308 8.42104 12.1802 8.42104 13.1975 7.40371L13.5041 7.09444C13.6723 6.92625 13.6723 6.64953 13.5041 6.48134L13.1975 6.17207C13.0565 6.031 12.91 5.90621 12.7526 5.79498L14.006 4.54434C14.261 4.28933 14.261 3.87698 14.006 3.62468C13.751 3.37238 13.3386 3.36967 13.0863 3.62468L11.4749 5.23613C10.916 5.11676 10.3355 5.13575 9.78475 5.2931C9.95023 4.71525 9.96379 4.10486 9.82273 3.52159L11.4016 1.93998C11.6566 1.68497 11.6566 1.27262 11.4016 1.02032C11.1466 0.768022 10.7343 0.76531 10.482 1.02032L9.23403 2.26282C9.13366 2.12717 9.02243 1.99695 8.89764 1.87488L8.59379 1.56832Z" fill="black" />
      </g>
      <defs>
        <clipPath id="clip0_7771_29082">
          <rect width="13.89" height="13.89" fill="white" transform="translate(0.306641 0.830078)" />
        </clipPath>
      </defs>
    </svg>
  );






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
                fontFamily: "Poppins, sans-serif",
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
            <span role="img" aria-label="settings">⚙️</span>
          </IconButton>
          <IconButton
            onClick={() => setShowGuide(true)}
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
            </Box>)}
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
              <Typography variant="body2" color="#111" fontFamily="Poppins, sans-serif">
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
              <div style={{ fontFamily: "Poppins, sans-serif" }}>
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
            <div style={{ fontFamily: "Poppins, sans-serif" }}>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                {/*<Button onClick={handleProvinceToMap} startIcon={<ArrowBackIosNewIcon />}*/}
                <IconButton
                  onClick={handleProvinceToMap}
                  size="small" // Makes it smaller
                  sx={{
                    padding: '4px',
                    backgroundColor: 'transparent'
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>

              </div>
              <h1>{provinceData.provinceStats.entityName}</h1>
              <p style={{
                fontFamily: "Poppins, sans-serif",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto 1fr",
                columnGap: "0px",
                rowGap: "10px",
                alignItems: "center"
              }}>
                <MountainIcon />
                <span>{provinceData.provinceStats.entityLandArea} km²</span>

                <PersonIcon />
                <span>{provinceData.provinceStats.entityHerders} herders</span>

                <WheatIcon />
                <span>{provinceData.provinceStats.entityGrazingRange}% grazing range</span>

                <UserIcon />
                <span>{provinceData.provinceStats.entityCitizens} citizens</span>
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
                    padding: '4px',
                    backgroundColor: 'transparent'
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
              </div>
              <h1>{countyData.countyStats.entityName}</h1>
              <p style={{
                fontFamily: "Poppins, sans-serif",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto 1fr",
                columnGap: "0px",
                rowGap: "10px",
                alignItems: "center"
              }}>
                <MountainIcon />
                <span> {countyData.countyStats.entityLandArea} km²</span>

                <PersonIcon />
                <span>{countyData.countyStats.entityHerders} herders</span>

                <WheatIcon />
                <span>{countyData.countyStats.entityGrazingRange}% grazing range</span>

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

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          {/*<AgricultureIcon sx={{ mr: 1 }} />
          
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
          />*/}
        </Box>
        <Typography variant="body2" color="text.secondary">
          View data only in land categorized as a grazing range.
        </Typography>
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
            width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
            maxHeight: '80vh',
            overflowY: 'auto',
            '& *': { fontFamily: "Poppins, sans-serif" } // This applies to all child elements
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Map Guide</Typography>
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
            <strong>yes you do</strong> times square don't shine as bright as you, i swear it's true.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default SidePanel;
