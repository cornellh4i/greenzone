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
import CircularProgress from "@mui/material/CircularProgress";

interface TopPanelProps {
  yearOptions: string[];
  //provinceOptions
  //CountyOptions
}
interface EntityOption {
  entity_id: number;
  entity_name: string;
  entity_type: string;
  entity_sub_id: number | null;
  entity_sub_name: string | null;
}

interface EntityMap {
  [entity_id: number]: EntityOption;
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
  } = context;
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // State to store counties dictionary
  const [entityMap, setEntityMap] = useState<EntityMap | undefined>(undefined);

  // Fetch counties from `getCounties` function
  const loadCountyData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/county");
      if (!response.ok) throw new Error("Failed to fetch county data");
      const json_object = await response.json();
      if (!json_object.data || !Array.isArray(json_object.data)) {
        throw new Error("Invalid data format from API");
      }
      const responseProv = await fetch("http://localhost:8080/api/province");
      if (!responseProv.ok) throw new Error("Failed to fetch county data");
      const json_object_prov = await responseProv.json();
      if (!json_object_prov.data || !Array.isArray(json_object_prov.data)) {
        throw new Error("Invalid data format from API");
      }

      const entityDict: EntityMap = {};
      json_object_prov.data.forEach(
        (province: {
          province_data: { province_name: string };
          province_id: number;
        }) => {
          var entityId = province.province_id;
          var entityName = province.province_data.province_name;
          var entityType = "Province";
          var entitySubId = null;
          var entitySubName = null;
          if (entityId && entityName) {
            entityDict[entityId] = {
              entity_id: entityId,
              entity_name: entityName,
              entity_type: entityType,
              entity_sub_id: entitySubId,
              entity_sub_name: entitySubName,
            };
          }
        }
      );
      json_object.data.forEach(
        (county: {
          county_data: { soum_name: string; province_name: string };
          county_id: number;
          province_id: number;
        }) => {
          var entityId = county.county_id;
          var entityName = county.county_data.soum_name;
          var entityType = "Soum";
          var entitySubId = county.province_id;
          var entitySubName = county.county_data.province_name;

          if (entityId && entityName && entitySubName) {
            entityDict[entityId] = {
              entity_id: entityId,
              entity_name: entityName,
              entity_type: entityType,
              entity_sub_id: entitySubId,
              entity_sub_name: entitySubName,
            };
          }
        }
      );

      setEntityMap(entityDict);
    } catch (error) {
      console.error("Error fetching county data:", error);
    }
  };

  useEffect(() => {
    loadCountyData();
  }, []);

  const handleValueSelect = async (entityData: EntityOption) => {
    if (entityData.entity_type == "Province") {
      setSelectedCounty(null);
      setSelectedProvince(null);
      // Set province first
      setSelectedProvince(entityData.entity_id);
    } else {
      // Retrieve the county ID from the countyMap using the selected county name
      setSelectedCounty(null);
      setSelectedProvince(null);

      // Set province first
      setSelectedProvince(entityData.entity_sub_id);

      // After a short delay, set county (allows province data to load)
      setSelectedCounty(entityData.entity_id);
    }
  };
  if (!entityMap) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          zIndex: 1300,
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "5px",
      }}
    >
      <div>
        <SearchBar entityMap={entityMap} onValueSelect={handleValueSelect} />
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
