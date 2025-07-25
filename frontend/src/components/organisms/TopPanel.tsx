import React, { useContext, useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@mui/material";
import { Box, Typography, useMediaQuery } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import { Context } from "../../utils/global";
import TopPanelLayerTypeSwitch from "../molecules/TopPanelLayerTypeSwitch";
import CircularProgress from "@mui/material/CircularProgress";
import { backendUrl } from "../../utils/const";

interface TopPanelProps {
  yearOptions: string[];
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
  const isMobile = useMediaQuery("(max-width:600px)");
  console.log(yearOptions);
  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const { setSelectedCounty, setSelectedProvince } = context;
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const [entityMap, setEntityMap] = useState<EntityMap | undefined>(undefined);

  const loadCountyData = async () => {
    try {
      const response = await fetch(`${backendUrl}/county`);
      if (!response.ok) throw new Error("Failed to fetch county data");
      const json_object = await response.json();
      if (!json_object.data || !Array.isArray(json_object.data)) {
        throw new Error("Invalid data format from API");
      }
      const responseProv = await fetch(`${backendUrl}/province`);
      if (!responseProv.ok) throw new Error("Failed to fetch county data");
      const json_object_prov = await responseProv.json();
      if (!json_object_prov.data || !Array.isArray(json_object_prov.data)) {
        throw new Error("Invalid data format from API");
      }

      const entityDict: EntityMap = {};
      json_object_prov.data.forEach(
        (province: {
          id: number;
          name: string;
          province_herders: number;
          province_land_area: number;
        }) => {
          const entityId = province.id;
          const entityName = province.name;
          const entityType = "Province";
          const entitySubId = null;
          const entitySubName = null;
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
          id: number;
          name: string;
          province_id: number;
          province_name: string;
        }) => {
          const entityId = county.id;
          const entityName = county.name;
          const entityType = "Soum";
          const entitySubId = county.province_id;
          const entitySubName = county.province_name;

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

  if (!isMobile) {
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
          onClick={() => handleNavigate("/landing")}
          sx={{
            // home button
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
  }

  return (
    <Box sx={{ backgroundColor: "white" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "600", fontSize: "22px" }}>
          Carrying Capacity Early Warning System
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <img
            src="/home.png"
            alt="Home"
            style={{ width: 24, height: 24 }}
            onClick={() => handleNavigate("/landing")}
          />
          <img
            src="/profile.png"
            alt="Profile"
            style={{ width: 24, height: 24 }}
            onClick={() => handleNavigate("/about")}
          />
        </Box>
      </Box>
      <div>
        <SearchBar entityMap={entityMap} onValueSelect={handleValueSelect} />
      </div>
    </Box>
  );
};

export default TopPanel;
