import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Tabs, Tab } from "@mui/material";
import LineGraph from "../charts/line-graph";
import Table from "../charts/Table";

interface LivestockData {
  aimag: string;
  data: { x: number; y: number }[];
}

interface SummaryData {
  ranking: number;
  name: string;
  belowCapacity: number;
  atCapacity: number;
  aboveCapacity: number;
}

const InsightsPanel: React.FC = () => {
  const [livestockData, setLivestockData] = useState<{ [key: string]: LivestockData[] }>({});
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [provinceIds, setProvinceIds] = useState<number[]>([]);
  const [countyIds, setCountyIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const livestockTypes = ["cattle", "horse", "goat", "camel", "sheep"];
  const dzudYears = [2017, 2016, 2020, 2021];
  const privatizationPeriods = [2012, 2015, 2018, 2013];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tableColumns = [
    { field: 'ranking', headerName: 'Ranking', width: 100 },
    { field: 'name', headerName: tabValue === 0 ? "Aimag" : "Soum", width: 200 },
    { field: 'belowCapacity', headerName: 'Below Capacity', width: 150, format: (value: number) => `${value}%` },
    { field: 'atCapacity', headerName: 'At Capacity', width: 150, format: (value: number) => `${value}%` },
    { field: 'aboveCapacity', headerName: 'Above Capacity', width: 150, format: (value: number) => `${value}%` },
  ];

  const fetchProvinceIds = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/province");
      const json = await response.json();

      if (json.data) {
        const ids = json.data.map((province: any) => province.province_id);
        setProvinceIds(ids);
      }
    } catch (error) {
      console.error("Error fetching province IDs:", error);
    }
  };

  const fetchCountyIds = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/county");
      const json = await response.json();

      if (json.data) {
        const ids = json.data.map((county: any) => county.county_id);
        setCountyIds(ids);
      }
    } catch (error) {
      console.error("Error fetching county IDs:", error);
    }
  };

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const ids = tabValue === 0 ? provinceIds : countyIds;
      const endpoint = tabValue === 0 ? "province" : "county";
  
      const promises = ids.map(async (id) => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/${endpoint}/${id}/carrying_capacity/cell-summary`
          );
  
          const text = await response.text();
          console.log(`🔹 Raw Response for ${endpoint} ${id}:`, text);
  
          // Ensure response is valid JSON
          if (response.headers.get("content-type")?.includes("application/json")) {
            const jsonData = JSON.parse(text);
            console.log(`✅ Parsed JSON for ${endpoint} ${id}:`, jsonData);
            return jsonData;
          } else {
            console.error(`Unexpected response format for ${endpoint} ${id}:`, text);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching data for ${endpoint} ${id}:`, error);
          return null;
        }
      });
  
      const results = await Promise.all(promises);
      console.log("🔹 All Results:", results);
  
      const validResults = results.filter((result) => result && result.data && result.data.length > 0);
  
      if (validResults.length === 0) {
        console.warn("⚠️ No valid data retrieved!");
      }
  
      const formattedSummaries = validResults.map((result, index) => ({
        ranking: index + 1,
        name: result.data[0]?.province_name || result.data[0]?.county_name || "Unknown",
        belowCapacity: result.data[0]?.cat1_percentage ?? 0,
        atCapacity: result.data[0]?.cat2_percentage ?? 0,
        aboveCapacity: result.data[0]?.cat3_percentage ?? 0,
      }));
  
      formattedSummaries.sort((a, b) => a.belowCapacity - b.belowCapacity);
  
      formattedSummaries.forEach((summary, index) => {
        summary.ranking = index + 1;
      });
  
      console.log("Final Summaries:", formattedSummaries);
  
      setSummaries(formattedSummaries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProvinceIds();
    fetchCountyIds();
  }, []);

  useEffect(() => {
    if ((tabValue === 0 && provinceIds.length > 0) || (tabValue === 1 && countyIds.length > 0)) {
      fetchSummaries();
    }
  }, [provinceIds, countyIds, tabValue]);

  return (
    <Box sx={{ backgroundColor: '#F3F4F6', py: 8 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: { xs: 2, md: 4 },
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: '#111827',
              mb: 4
            }}
          >
            Key Conclusions
          </Typography>

          <Box sx={{ p: 4, borderRadius: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#111827',
                mb: 3
              }}
            >
              Regions by Carrying Capacity & Breakdown
            </Typography>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              mb: 3
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .Mui-selected': {
                    color: '#2563EB',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#2563EB',
                  }
                }}
              >
                <Tab label="Aimags" />
                <Tab label="Soums" />
              </Tabs>
            </Box>
            <Table
              columns={tableColumns}
              rows={summaries}
              loading={loading}
            />
          </Box>

          <Box sx={{ p: 4, borderRadius: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#111827',
                mb: 3
              }}
            >
              Livestock Population by Type and Year
            </Typography>
            <Box
              sx={{
                width: '100%',
                overflowX: 'auto',
                mx: -4,
                px: 4,
                '& > div': {
                  minWidth: '1500px',
                  width: '100%',
                  height: '600px',
                }
              }}
            >
              {Object.keys(livestockData).length > 0 && (
                <LineGraph
                  datasets={Object.values(livestockData).flat()}
                  livestock="all"
                  dzudYears={dzudYears}
                  privatizationPeriods={privatizationPeriods}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InsightsPanel;
