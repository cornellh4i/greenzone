/*  Location: On the TopPanel
 */
import React, { useContext } from "react";
import { Context, LayerType } from "../../utils/global";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";

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
    "2022",
  ];

  const buttonStyle = (isActive: boolean | null, color: string) => ({
    backgroundColor: isActive ? color : "grey",
    borderRadius: "50px",
    padding: "10px 20px",
    width: "100px",
    height: "40px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "bold",
    flex: "1 1 auto",
    minWidth: "100px",
    maxWidth: "200px",
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
        label="Select Year"
        options={years}
        value={selectedYear.toString()}
        onChange={(val) => setSelectedYear(val)}
        sx={{
          width: "120px",
          height: "40px",
          borderRadius: "30px",
          backgroundColor: "white", // Match button color
          fontSize: "14px",
          color: "black",
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Year: {selectedYear}</span>
        </div>
      </Dropdown>
      <Button
        onClick={() => setGrazingRange((prev) => !prev)}
        label="Grazing Range"
        sx={buttonStyle(grazingRange, "green")}
      />

      <div
        style={{
          backgroundColor: "#e6e6e6",
          padding: "15px",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "nowrap",
          overflowX: "auto",
          width: "60%",
          gap: "10px",
        }}
      >
        {selectedLayerType == LayerType.CarryingCapacity && (
          <>
            <Button
              onClick={() => setShowBelowCells(!showBelowCells)}
              label="Below"
              sx={buttonStyle(showBelowCells, "green")}
              disabled={!(selectedLayerType == LayerType.CarryingCapacity)}
            />
            <Button
              onClick={() => setShowAtCapCells(!showAtCapCells)}
              label="At Capacity"
              sx={buttonStyle(showAtCapCells, "#C6BF31")}
              disabled={!(selectedLayerType == LayerType.CarryingCapacity)}
            />
            <Button
              onClick={() => setShowAboveCells(!showAboveCells)}
              label="Above"
              sx={buttonStyle(showAboveCells, "red")}
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
            backgroundColor: "#555",
            color: "white",
            borderRadius: "12px",
            padding: "10px 20px",
            width: "140px",
            height: "50px",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        />
      </div>
    </div>
  );
};

export default TopPanelLayerTypeSwitch;
