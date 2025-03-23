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
import { GetCounties } from "../../../../../backend/src/controller/County.ts";

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
    setSearched,
    setDisplayName,
    setTopPanelOpen,
    setSelectedCounty,
    setSelectedProvince,
    //   selectedProvince,
    //   isPanelOpen,
    //   setIsPanelOpen,
    //   isTopPanelOpen,
    //   setTopPanelOpen,
    //   carryingCapacity,
    //   setCarryingCapacity,
    //   showBelowCells,
    //   setShowBelowCells,
    //   showAtCapCells,
    //   setShowAtCapCells,
    //   showAboveCells,
    //   setShowAboveCells,
    //   ndviSelect,
    //   setNdviSelect,
    //   showPositiveCells,
    //   setShowPositiveCells,
    //   showZeroCells,
    //   setShowZeroCells,
    //   showNegativeCells,
    //   setShowNegativeCells,
    //   selectedYear,
    //   setSelectedYear,
    //   grazingRange,
    //   setGrazingRange,
    //   selectedOption,
    //   setSelectedOption,
    //   displayName,
    //   setSearched,
    //   setDisplayName,
    //   selectedLayerType,
    //   setSelectedLayerType,
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
    "Bayan-Ulgii",
    "Khovd",
    "Govi-Altai",
    "Bayankhongor",
    "Umnugovi",
    "Khuvsgul",
    "Selenge",
    "Tuv",
    "Orkhon",
    "Ulaanbaatar",
    "Sukhbaatar",
    "Dornogovi",
    "Bulgan",
    "Uvs",
    "Zavkhan",
    "Khentii",
    "Darkhan-Uul",
    "Govisumber",
    "Arkhangai",
    "Dundgovi",
    "Uvurkhangai",
  ];

  // State to store counties dictionary
  const [countyMap, setCountyMap] = useState<{
    [county_id: number]: {
      county_id: number;
      county_name: string;
      province_name: string;
    };
  }>(undefined);

  // Fetch counties from `getCounties` function
  const loadCountyData = async () => {
    try {
      console.log("Fetching county data...");

      const response = await fetch("http://localhost:8080/api/county");
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch county data");

      const json_object = await response.json();

      if (!json_object.data || !Array.isArray(json_object.data)) {
        throw new Error("Invalid data format from API");
      }

      const countyDictionary: {
        [county_id: number]: {
          county_id: number;
          county_name: string;
          province_name: string;
        };
      } = {};

      json_object.data.forEach(
        (county: {
          county_data: { soum_name: string; province_name: string };
          county_id: number;
        }) => {
          var countyId = county.county_id;
          var countyName = county.county_data.soum_name;
          var provinceName = county.county_data.province_name;
          if (countyId && countyName && provinceName) {
            countyDictionary[countyId] = {
              county_id: countyId,
              county_name: countyName,
              province_name: provinceName,
            };
          }
        }
      );

      setCountyMap(countyDictionary);
    } catch (error) {
      console.error("Error fetching county data:", error);
    }
  };

  useEffect(() => {
    loadCountyData();
  }, []);

  /*const handleValueSelect = async (provinceData: { value: number }) => {
    setSearched(provinceData.value);
    setDisplayName(provinceData);
    setTopPanelOpen(true);
  };*/

  const handleValueSelect = async (countyData: { ID: number, name: string }) => {
    // Retrieve the county ID from the countyMap using the selected county name
    const countyId = countyData.ID;

    if (countyId) {
      // Update the searched value with the county ID
      setSearched(countyId);

      // Update the display name with the selected county name
      setDisplayName({ value: countyData.county_name });

      // Open the top panel (if needed)
      setTopPanelOpen(true);

      setSelectedCounty(countyId);
    } else {
      console.error("County ID not found for:", countyData.county_name);
    }
  };
  if (!countyMap) return <div>LOADING</div>;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Adjusts layout distribution
        gap: "10px",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "15px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
      }}
    >
      <div style={{ flex: 1 }}>
        <SearchBar countyMap={countyMap} onValueSelect={handleValueSelect} />
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
  //   <div
  //     style={{
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "space-between", // Adjusts layout distribution
  //       gap: "15px",
  //       padding: "10px",
  //       backgroundColor: "rgba(255, 255, 255, 0.8)",
  //       borderRadius: "15px",
  //       boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  //     }}
  //   >
  //     <div style={{ flex: 1 }}>
  //       <SearchBar uniqueData={uniqueData} onValueSelect={handleValueSelect} />
  //     </div>

  //     <Context.Provider value={context}>
  //       <TopPanelLayerTypeSwitch />
  //     </Context.Provider>

  //     <Button
  //       onClick={() => navigateTo("/landing")}
  //       sx={{
  //         backgroundColor: "grey",
  //         width: "50px",
  //         height: "50px",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         borderRadius: "12px",
  //       }}
  //       startIcon={<HomeIcon />}
  //     />

  //     <Button
  //       onClick={() => {}} // Placeholder for future routing
  //       sx={{
  //         backgroundColor: "transparent",
  //         width: "50px",
  //         height: "50px",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //       startIcon={
  //         <Avatar sx={{ width: "40px", height: "40px" }}>
  //           <PersonIcon />
  //         </Avatar>
  //       }
  //     />
  //   </div>
  // );
};

export default TopPanel;
