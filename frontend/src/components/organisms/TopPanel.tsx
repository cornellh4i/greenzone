/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck comment
import React, { useContext, useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Context, LayerType } from "../../utils/global";
import TopPanelLayerTypeSwitch from "../molecules/TopPanelLayerTypeSwitch";

interface TopPanelProps {
  yearOptions: string[];
  //provinceOptions
  //CountyOptions
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
    selectedLayerType,
    setSelectedLayerType,
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

  const handleValueSelect = async (provinceData: { value: number }) => {
    setSearched(provinceData.value);
    setDisplayName(provinceData);
    setTopPanelOpen(true);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Adjusts layout distribution
        gap: "15px",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "15px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
      }}
    >
      <div style={{ flex: 1 }}>
        <SearchBar uniqueData={uniqueData} onValueSelect={handleValueSelect} />
      </div>

      <Context.Provider value={context}>
        <TopPanelLayerTypeSwitch />
      </Context.Provider>

      <Button
        onClick={() => navigateTo("/landing")}
        sx={{
          backgroundColor: "grey",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
        }}
        startIcon={<HomeIcon />}
      />

      <Button
        onClick={() => {}} // Placeholder for future routing
        sx={{
          backgroundColor: "transparent",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        startIcon={
          <Avatar sx={{ width: "40px", height: "40px" }}>
            <PersonIcon />
          </Avatar>
        }
      />
    </div>
  );
};

export default TopPanel;
