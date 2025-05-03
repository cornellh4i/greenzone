/*  Location: On the TopPanel
 */
import React, { useContext } from "react";
import { Context, LayerType } from "../../utils/global";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";
import { SvgIcon } from '@mui/material'
import Leaf from "../frontend/public/leaf_icon.png"
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

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

  const LeafIcon = ({ isActive, color }: { isActive: boolean | null, color: string }) => (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.0678 6.06914C9.91034 6.06914 7.23892 8.13799 6.33103 10.9902C7.68081 10.3073 9.20332 9.92563 10.8182 9.92563H14.3533C14.7069 9.92563 14.9961 10.2149 14.9961 10.5684C14.9961 10.9219 14.7069 11.2111 14.3533 11.2111H13.7106H10.8182C10.1514 11.2111 9.50461 11.2875 8.87793 11.4281C7.83748 11.6651 6.87335 12.0869 6.00966 12.6613C3.67969 14.216 2.14111 16.8713 2.14111 19.8882V20.531C2.14111 21.0653 2.57095 21.4951 3.10524 21.4951C3.63952 21.4951 4.06936 21.0653 4.06936 20.531V19.8882C4.06936 17.9319 4.90092 16.1724 6.2306 14.9391C7.02601 17.972 9.78581 20.2096 13.0678 20.2096H13.108C18.4147 20.1815 22.7091 14.9511 22.7091 8.50355C22.7091 6.79223 22.4078 5.16527 21.8615 3.699C21.757 3.42181 21.3513 3.43387 21.2107 3.69498C20.4554 5.10903 18.9611 6.06914 17.2457 6.06914H13.0678Z" fill={isActive ? "white" : color} />
    </svg>
  )

  const ControlIcon = ({ isActive, color }: { isActive: boolean | null, color: string }) => (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.1381 8.63873H14.9961V7.35323H20.1381V8.63873ZM4.06936 4.78223C3.00481 4.78223 2.14111 5.64592 2.14111 6.71048V9.28148C2.14111 10.346 3.00481 11.2097 4.06936 11.2097H20.7809C21.8454 11.2097 22.7091 10.346 22.7091 9.28148V6.71048C22.7091 5.64592 21.8454 4.78223 20.7809 4.78223H4.06936ZM20.1381 16.3517V17.6372H9.85411V16.3517H20.1381ZM4.06936 13.7807C3.00481 13.7807 2.14111 14.6444 2.14111 15.709V18.28C2.14111 19.3445 3.00481 20.2082 4.06936 20.2082H20.7809C21.8454 20.2082 22.7091 19.3445 22.7091 18.28V15.709C22.7091 14.6444 21.8454 13.7807 20.7809 13.7807H4.06936Z" fill={isActive ? "white" : color} />
    </svg>
  )




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

      {/*<Button
        onClick={() => setGrazingRange((prev) => !prev)}
        label="Grazing Range"
        sx={{
          ...buttonStyle(grazingRange, "#065143"),
          minWidth: "250px",   // CHANGED: Increased from 100px
          maxWidth: "300px"    // CHANGED: Increased from 200px
        }}
      />*/}

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
              startIcon={<ControlIcon isActive={showPositiveCells} color="teal" />}
              disabled={!(selectedLayerType == LayerType.ZScore)}
            />
            <Button
              onClick={() => setShowZeroCells(!showZeroCells)}
              label="Zero"
              sx={buttonStyle(showZeroCells, "darkblue")}
              startIcon={<ControlIcon isActive={showZeroCells} color="darkblue" />}
              disabled={!(selectedLayerType == LayerType.ZScore)}
            />
            <Button
              onClick={() => setShowNegativeCells(!showNegativeCells)}
              label="Negative"
              sx={buttonStyle(showNegativeCells, "purple")}
              startIcon={<ControlIcon isActive={showNegativeCells} color="purple" />}
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
          startIcon={<SwapHorizIcon />}

        />

      </div>
    </div>
  );
};

export default TopPanelLayerTypeSwitch;
