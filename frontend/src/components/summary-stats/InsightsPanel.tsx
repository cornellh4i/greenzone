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
  const [provinceSummaries, setProvinceSummaries] = useState<SummaryData[]>([]);
  const [countySummaries, setCountySummaries] = useState<SummaryData[]>([]);
  const [provinceIds, setProvinceIds] = useState<number[]>([]);
  const [countyIds, setCountyIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);

  const livestockTypes = ["cattle", "horse", "goat", "camel", "sheep"];
  const dzudYears = [2017, 2016, 2020, 2021];
  const privatizationPeriods = [2012, 2015, 2018, 2013];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  const tableColumns = [
    { field: 'ranking', headerName: 'Ranking', width: 100 },
    { field: 'name', headerName: tabValue === 0 ? "Aimag" : "Soum", width: 200 },
  ...(tabValue === 1 ? [{ field: 'aimag', headerName: 'Aimag', width: 200 }] : []),
    { field: 'belowCapacity', headerName: 'Below Capacity', width: 150, format: (value: number) => `${value}%` },
    { field: 'atCapacity', headerName: 'At Capacity', width: 150, format: (value: number) => `${value}%` },
    { field: 'aboveCapacity', headerName: 'Above Capacity', width: 150, format: (value: number) => `${value}%` },
  ];

  const fetchProvinceIds = async () => {
    try {
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

  const fetchSummariesFromIds = async (
    ids: number[],
    endpoint: "province" | "county",
    setSummaries: React.Dispatch<React.SetStateAction<SummaryData[]>>
  ) => {
    try {
      setLoading(true);
      const promises = ids.map(async (id) => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/${endpoint}/${id}/carrying_capacity/cell-summary`
          );
          const text = await response.text();

          if (response.headers.get("content-type")?.includes("application/json")) {
            const jsonData = JSON.parse(text);
            return jsonData;
          } else {
            console.error(`Unexpected format for ${endpoint} ${id}:`, text);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching summary for ${endpoint} ${id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validResults = results.filter((result) => result && result.data && result.data.length > 0);

      const formattedSummaries = validResults.map((result, index) => {    
        console.log("Result data:", result.data);
        return {
          ranking: index + 1,
          name: result.data[0]?.soum_name ?? "Unknown",
          aimag: result.data[0]?.province_name ?? "Unknown",
          belowCapacity: result.data[0]?.cat1_percentage ?? 0,
          atCapacity: result.data[0]?.cat2_percentage ?? 0,
          aboveCapacity: result.data[0]?.cat3_percentage ?? 0,
        };
      });

      formattedSummaries.sort((a, b) => {
        if (b.aboveCapacity !== a.aboveCapacity) {
          return b.aboveCapacity - a.aboveCapacity; // Descending
        } else if (b.atCapacity !== a.atCapacity) {
          return b.atCapacity - a.atCapacity; // Descending
        } else {
          return a.belowCapacity - b.belowCapacity; // Ascending
        }
      });
      formattedSummaries.forEach((summary, index) => (summary.ranking = index + 1));

      setSummaries(formattedSummaries);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    fetchProvinceIds();
    fetchCountyIds();
  }, []);

  useEffect(() => {
    if (provinceIds.length > 0) {
      fetchSummariesFromIds(provinceIds, "province", setProvinceSummaries);
    }
  }, [provinceIds]);
  
  useEffect(() => {
    if (countyIds.length > 0) {
      fetchSummariesFromIds(countyIds, "county", setCountySummaries);
    }
  }, [countyIds]);

  useEffect(() => {
    const fetchLivestockData = async () => {
      try {
        const allData: { [key: string]: LivestockData[] } = {};
        await Promise.all(
          livestockTypes.map(async (type) => {
            const response = await fetch(`http://localhost:8080/api/provincebyclass/${type}`);
            const json = await response.json();
            const formattedData = [{
              aimag: type,
              data: json.data.map((item: any) => ({
                x: item.year,
                y: item.livestock_count,
              })),
            }];
            allData[type] = formattedData;
          })
        );
        setLivestockData(allData);
      } catch (error) {
        console.error("Error fetching livestock data:", error);
        setLoading(false);
      }
    };
  
    fetchLivestockData();
  }, []);  

  return (
    <Box sx={{ backgroundColor: '#F3F4F6', py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, padding: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 4 }}>
            Key Conclusions
          </Typography>

          <Box sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 3 }}>
              Regions by Carrying Capacity & Breakdown
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .Mui-selected': { color: '#2563EB' },
                  '& .MuiTabs-indicator': { backgroundColor: '#2563EB' },
                }}
              >
                <Tab label="Aimags" />
                <Tab label="Soums" />
              </Tabs>
            </Box>
            <Table
  columns={tableColumns}
  rows={tabValue === 0 ? provinceSummaries : countySummaries}
  loading={loading}
  page={page}
  onPageChange={(newPage: number) => setPage(newPage)}
/>
          </Box>

          <Box sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 3 }}>
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
                },
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
