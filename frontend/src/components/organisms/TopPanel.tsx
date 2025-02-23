import React, { useContext, useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Context } from "../../utils/global";

interface TopPanelProps {
  yearOptions: string[];
}

const TopPanel: React.FC<TopPanelProps> = ({ yearOptions }) => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    selectedProvince,
    isPanelOpen,
    setIsPanelOpen,
    isTopPanelOpen,
    setTopPanelOpen,
    carryingCapacity,
    setCarryingCapacity,
    showBelowCells,
    setShowBelowCells,
    showAtCapCells,
    setShowAtCapCells,
    showAboveCells,
    setShowAboveCells,
    ndviSelect,
    setNdviSelect,
    showPositiveCells,
    setShowPositiveCells,
    showZeroCells,
    setShowZeroCells,
    showNegativeCells,
    setShowNegativeCells,
    selectedYear,
    setSelectedYear,
    grazingRange,
    setGrazingRange,
    selectedOption,
    setSelectedOption,
    displayName,
    setSearched,
    setDisplayName,
  } = context;
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const specialCharsToEnglishMap = {
    Ö: "U",
    ö: "u",
    ü: "u",
    ĭ: "i",
    Ё: "yo",
    ё: "yo",
  };

  const uniqueData = [
    "Dornod",
    "Bayan-Ölgii",
    "Khovd",
    "Sükhbaatar",
    "Dornogovi",
    "Govi-Altai",
    "Bayankhongor",
    "Ömnögovi",
    "Khövsgöl",
    "Bulgan",
    "Uvs",
    "Selenge",
    "Zavkhan",
    "Khentii",
    "Darkhan-Uul",
    "Töv",
    "Arkhangai",
    "Orkhon",
    "Dundgovi",
    "Övörkhangai",
    "Govisümber",
  ];

  const toggleCellState = (cellType: string) => {
    switch (cellType) {
      case "below":
        setShowBelowCells((prev) => !prev);
        break;
      case "atCap":
        setShowAtCapCells((prev) => !prev);
        break;
      case "above":
        setShowAboveCells((prev) => !prev);
        break;
      case "positive":
        setShowPositiveCells((prev) => !prev);
        break;
      case "zero":
        setShowZeroCells((prev) => !prev);
        break;
      case "negative":
        setShowNegativeCells((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const getButtonColor = (cellType: string) => {
    // Disable if neither carryingCapacity nor ndviSelect is true
    if (!carryingCapacity && !ndviSelect) {
      return { backgroundColor: "gray" }; // Disable if neither are selected
    }

    // If carryingCapacity is true, handle colors for "below", "atCap", "above" cells
    if (carryingCapacity) {
      switch (cellType) {
        case "below":
          return { backgroundColor: showBelowCells ? "green" : "grey" }; // Green for "below" cells if active
        case "atCap":
          return { backgroundColor: showAtCapCells ? "#C6BF31" : "grey" }; // Yellow for "atCap" cells if active
        case "above":
          return { backgroundColor: showAboveCells ? "red" : "grey" }; // Red for "above" cells if active
        default:
          return {};
      }
    }

    // If ndviSelect is true, handle colors for "positive", "zero", "negative" cells
    if (ndviSelect) {
      switch (cellType) {
        case "positive":
          return { backgroundColor: showPositiveCells ? "teal" : "grey" }; // Teal for "positive" cells if active
        case "zero":
          return { backgroundColor: showZeroCells ? "darkblue" : "grey" }; // Dark Blue for "zero" cells if active
        case "negative":
          return { backgroundColor: showNegativeCells ? "purple" : "grey" }; // Purple for "negative" cells if active
        default:
          return {};
      }
    }

    return {}; // Default case (should never be reached if above logic is correct)
  };

  // const transformString = (name: string): string => {
  //   let transformedName = "";
  //   console.log(name);
  //   for (let char of name) {
  //     // Log each character and its transformed value
  //     const transformedChar = specialCharsToEnglishMap[char] || char;
  //     transformedName += transformedChar;
  //   }

  //   return transformedName; // Return the transformed string
  // };

  const handleValueSelect = async (provinceData: { value: number }) => {
    setSearched(provinceData.value);
    // onProvinceSelect({ name: transformedName });
    setDisplayName(provinceData);
    setTopPanelOpen(true);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div>
          <SearchBar
            uniqueData={uniqueData}
            onValueSelect={handleValueSelect}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            width: "100%",
          }}
        >
          {isTopPanelOpen && (
            <Dropdown
              label="Select Year"
              options={yearOptions}
              value={selectedYear.toString()}
              onChange={(val) => setSelectedYear(val)}
              sx={{ width: "160px" }}
            />
          )}
          {isTopPanelOpen && (
            <Button
              onClick={() => setGrazingRange((prev) => !prev)}
              label="Grazing Range"
              sx={{
                backgroundColor: grazingRange ? "green" : "grey",
              }}
            />
          )}
          {isTopPanelOpen && carryingCapacity && (
            <>
              <Button
                onClick={() => toggleCellState("below")}
                label="Below"
                sx={getButtonColor("below")}
                disabled={!carryingCapacity} // Disable if carryingCapacity is false
              />
              <Button
                onClick={() => toggleCellState("atCap")}
                label="AtCap"
                sx={getButtonColor("atCap")}
                disabled={!carryingCapacity} // Disable if carryingCapacity is false
              />
              <Button
                onClick={() => toggleCellState("above")}
                label="Above"
                sx={getButtonColor("above")}
                disabled={!carryingCapacity} // Disable if carryingCapacity is false
              />
            </>
          )}
          {isTopPanelOpen && ndviSelect && (
            <>
              <Button
                onClick={() => toggleCellState("positive")}
                label="Positive"
                sx={getButtonColor("positive")}
                disabled={!ndviSelect} // Disable if carryingCapacity is false
              />
              <Button
                onClick={() => toggleCellState("zero")}
                label="Zero"
                sx={getButtonColor("zero")}
                disabled={!ndviSelect} // Disable if carryingCapacity is false
              />
              <Button
                onClick={() => toggleCellState("negative")}
                label="Negative"
                sx={getButtonColor("negative")}
                disabled={!ndviSelect} // Disable if carryingCapacity is false
              />
            </>
          )}
          {/* Toggle carrying capacity */}
          {isTopPanelOpen && (
            <Button
              onClick={() => {
                if (carryingCapacity) {
                  // If we're currently on Carrying Capacity, switch to NDVI
                  setCarryingCapacity(false);
                  setNdviSelect(true);
                  setSelectedOption("zScore");
                  // Reset NDVI-related states
                  setShowAboveCells(false);
                  setShowAtCapCells(false);
                  setShowBelowCells(false);
                  setShowNegativeCells(false);
                  setShowPositiveCells(false);
                  setShowZeroCells(false);
                } else {
                  setCarryingCapacity(true);
                  setNdviSelect(false);
                  setSelectedOption("carryingCapacity");
                  setShowBelowCells(false);
                  setShowAtCapCells(false);
                  setShowAboveCells(false);
                  setShowNegativeCells(false);
                  setShowPositiveCells(false);
                  setShowZeroCells(false);
                }
              }}
              label={carryingCapacity ? "Switch to NDVI" : "Switch to CarCap"}
              sx={{ marginBottom: 2 }}
              startIcon={<SwapHorizIcon />}
            />
          )}
        </div>
        <Button
          onClick={() => navigateTo("/landing")}
          sx={{
            backgroundColor: "grey",
          }}
          startIcon={<HomeIcon />}
        />
        <Button
          onClick={() => {}} // Placeholder for future routing
          sx={{
            backgroundColor: "transparent",
          }}
          startIcon={
            <Avatar>
              <PersonIcon />
            </Avatar>
          }
        />
      </div>
    </div>
  );
};

export default TopPanel;
