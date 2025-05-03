import React, { useContext, useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@mui/material";
import { Box, Typography, useMediaQuery } from "@mui/material";
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

const LeafIcon = () => (
  <svg style={{ paddingTop: "10px" }} width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.2483 6.96753C12.3014 6.96753 8.9621 9.55359 7.82724 13.1188C9.51446 12.2652 11.4176 11.7881 13.4362 11.7881H17.8551C18.297 11.7881 18.6586 12.1497 18.6586 12.5916C18.6586 13.0335 18.297 13.395 17.8551 13.395H17.0517H13.4362C12.6027 13.395 11.7942 13.4904 11.0109 13.6662C9.7103 13.9624 8.50514 14.4897 7.42553 15.2078C4.51307 17.1511 2.58984 20.4703 2.58984 24.2414V25.0448C2.58984 25.7127 3.12714 26.25 3.795 26.25C4.46285 26.25 5.00015 25.7127 5.00015 25.0448V24.2414C5.00015 21.7959 6.0396 19.5965 7.70171 18.0549C8.69596 21.8462 12.1457 24.6431 16.2483 24.6431H16.2985C22.9318 24.608 28.2998 18.07 28.2998 10.0105C28.2998 7.87139 27.9232 5.83769 27.2403 4.00485C27.1097 3.65837 26.6026 3.67344 26.4268 3.99983C25.4828 5.76739 23.6148 6.96753 21.4706 6.96753H16.2483Z" fill="black" />
  </svg>

)

const TopPanel: React.FC<TopPanelProps> = ({ yearOptions }) => {
  const context = useContext(Context);
  const isMobile = useMediaQuery('(max-width:600px)');

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

  const handleNavigate = (path: string) => {
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
          onClick={() => { }} // Placeholder for future routing
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
    <Box sx={{ backgroundColor: 'white' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: '600', fontSize: '22px' }}>
          Carrying Capacity Early Warning System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <img src="/home.png" alt="Home" style={{ width: 24, height: 24 }} onClick={() => handleNavigate('/landing')} />
          <img src="/profile.png" alt="Profile" style={{ width: 24, height: 24 }} onClick={() => handleNavigate('/about')} />
        </Box>
      </Box>
      <div>
        <SearchBar entityMap={entityMap} onValueSelect={handleValueSelect} />
      </div>
    </Box>
  );
};

export default TopPanel;