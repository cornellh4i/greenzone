/*  Location: On the TopPanel
 */
import React, { useContext } from "react";
import { Context, LayerType } from "../../utils/global";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";
import Leaf from "../frontend/src/icons/leaf (1).svg"

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
    grazingRange,
    setGrazingRange,
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
    "2022"
  ];

  /*const buttonStyle = (isActive: boolean | null, color: string) => ({
    backgroundColor: isActive ? color : "transparent",
    border: isActive ? "none" : `2px solid ${color}`,
    color: isActive ? "white" : color,
    borderRadius: "48px",
    padding: "12px 24px 12px 24px",
    width: "80px",
    height: "35px",
    textAlign: "center",
    fontSize: "11.5px",
    fontWeight: "bold",
    flex: "1 1 auto",
    minWidth: "100px",
    maxWidth: "200px",
  });*/
  const buttonStyle = (isActive: boolean | null, color: string, icon?: string) => ({
    backgroundColor: isActive ? color : "transparent",
    border: isActive ? "none" : `2px solid ${color}`,
    color: isActive ? "white" : color,
    borderRadius: "48px",
    padding: "12px 24px 12px 24px",
    width: "80px",
    height: "35px",
    fontSize: "11.5px",
    fontWeight: "bold",
    flex: "1 1 auto",
    minWidth: "100px",
    maxWidth: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",  // Space between icon and text
    position: "relative", // For positioning pseudo-elements if needed
  });

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

      <Button
        onClick={() => setGrazingRange((prev) => !prev)}
        label="Grazing Range"
        sx={{
          ...buttonStyle(grazingRange, "#065143"),
          minWidth: "250px",   // CHANGED: Increased from 100px
          maxWidth: "300px"    // CHANGED: Increased from 200px
        }}
      />

      <div
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
        }}
      >
        {selectedLayerType == LayerType.CarryingCapacity && (
          <>
            <Button
              onClick={() => setShowBelowCells(!showBelowCells)}
              label="Below"
              sx={buttonStyle(showBelowCells, "#008A16")}
              disabled={!(selectedLayerType == LayerType.CarryingCapacity)}
            />
            <Button
              onClick={() => setShowAtCapCells(!showAtCapCells)}
              label="At Capacity"
              sx={buttonStyle(showAtCapCells, "#A66605")}
              disabled={!(selectedLayerType == LayerType.CarryingCapacity)}
            />
            <Button
              onClick={() => setShowAboveCells(!showAboveCells)}
              label="Above"
              sx={buttonStyle(showAboveCells, "#BF0022")}
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
              disabled={!(selectedLayerType == LayerType.ZScore)}
            />
            <Button
              onClick={() => setShowZeroCells(!showZeroCells)}
              label="Zero"
              sx={buttonStyle(showZeroCells, "darkblue")}
              disabled={!(selectedLayerType == LayerType.ZScore)}
            />
            <Button
              onClick={() => setShowNegativeCells(!showNegativeCells)}
              label="Negative"
              sx={buttonStyle(showNegativeCells, "purple")}
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
            padding: "1px 1px",
            width: "100px",
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
              border: "none"
            },
            "&:focus": {
              boxShadow: "none",
              backgroundColor: "transparent",
              border: "none"
            },
            "&:active": {
              boxShadow: "none",
              backgroundColor: "transparent",
              border: "none"
            }

          }}
        />

      </div>
    </div>
  );
};

export default TopPanelLayerTypeSwitch;
