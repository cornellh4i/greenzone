/*  Location: On the TopPanel
 */
import React, { useContext } from "react";
import { Context, LayerType } from "../../utils/global";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { buttonStyle, LeafIcon, ControlIcon } from "../../utils/const";
import { Box } from "@mui/material";

const TopPanelLayerTypeSwitch = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    showBelowCells,
    setShowBelowCells,
    showAtCapCells,
    setShowAtCapCells,
    showAboveCells,
    setShowAboveCells,
    showPositiveCells,
    setShowPositiveCells,
    showZeroCells,
    setShowZeroCells,
    showNegativeCells,
    setShowNegativeCells,
    selectedLayerType,
    setSelectedLayerType,
    selectedYear,
    setSelectedYear,
  } = context;
  const years = [
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
  ];
  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        overflowX: "auto",
        width: "100%",
        maxWidth: "100vw",
        gap: "10px",
      }}
    >
      <Dropdown
        options={years}
        value={selectedYear.toString()}
        onChange={(val) => setSelectedYear(Number(val))}
        label={""}
        sx={{
          width: "120px",
          backgroundColor: "white",
          fontSize: "8px",
          color: "black",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      />

      <Box
        style={{
          backgroundColor: "#E6EEEC",
          padding: "12px 24px 12px 24px",
          borderRadius: "48px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "nowrap",
          overflowX: "auto",
          width: "70%",
          gap: "10px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {selectedLayerType == LayerType.CarryingCapacity && (
          <>
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
          </>
        )}
        {selectedLayerType == LayerType.ZScore && (
          <>
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
          </>
        )}
        <Button
          onClick={() => {
            if (selectedLayerType == LayerType.CarryingCapacity) {
              setSelectedLayerType(LayerType.ZScore);
            } else {
              setSelectedLayerType(LayerType.CarryingCapacity);
            }
            setShowBelowCells(false);
            setShowAtCapCells(false);
            setShowAboveCells(false);
            setShowNegativeCells(false);
            setShowPositiveCells(false);
            setShowZeroCells(false);
          }}
          label={
            selectedLayerType == LayerType.CarryingCapacity
              ? "Switch to NDVI"
              : "Switch to CarCap"
          }
          sx={{
            backgroundColor: "transparent",
            color: "#343536",
            borderRadius: "25px",
            //padding: "1px 1px",
            width: "200px",
            height: "35px",
            fontSize: "12px",
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationThickness: 2,
            textUnderlineOffset: 3,
            minWidth: "150px",
            maxWidth: "250px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "transparent",
              border: "none",
            },
            "&:focus": {
              boxShadow: "none",
              backgroundColor: "transparent",
              border: "none",
            },
            "&:active": {
              boxShadow: "none",
              backgroundColor: "transparent",
              border: "none",
            },
          }}
          startIcon={<SwapHorizIcon />}
        />
      </Box>
    </div>
  );
};

export default TopPanelLayerTypeSwitch;
