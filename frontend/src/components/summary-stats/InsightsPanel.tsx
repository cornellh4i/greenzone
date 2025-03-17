import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Tabs, Tab } from "@mui/material";
import LineGraph from "../charts/line-graph";
import Table from "../charts/Table";

interface LivestockData {
  aimag: string;
  data: { x: number; y: number }[];
}

interface ProvinceSummary {
  ranking: number;
  aimag: string;
  belowCapacity: number;
  atCapacity: number;
  aboveCapacity: number;
}

const InsightsPanel: React.FC = () => {
  const [livestockData, setLivestockData] = useState<{ [key: string]: LivestockData[] }>({});
  const [provinceSummaries, setProvinceSummaries] = useState<ProvinceSummary[]>([]);
  const [provinceIds, setProvinceIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  const livestockTypes = ["cattle", "horse", "goat", "camel", "sheep"];
  const dzudYears = [2017, 2016, 2020, 2021];
  const privatizationPeriods = [2012, 2015, 2018, 2013];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tableColumns = [
    { field: 'ranking', headerName: 'Ranking', width: 100, format: (value: number) => value.toString() },
    { field: 'aimag', headerName: 'Aimag', width: 200 },
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

  const fetchProvinceSummaries = async () => {
    try {
      setLoading(true);
      const promises = provinceIds.map((provinceId) =>
        fetch(`http://localhost:8080/api/${provinceId}/carrying_capacity/cell-summary`)
          .then((response) => response.json())
          .catch((error) => {
            console.error(`Error fetching data for province ${provinceId}:`, error);
            return null;
          })
      );

      const results = await Promise.all(promises);
      const validResults = results.filter(result => result && result.data && result.data.length > 0);

      const formattedSummaries = validResults.map((result, index) => ({
        ranking: index + 1,
        aimag: result.data[0].province_name,
        belowCapacity: result.data[0].cat1_percentage,
        atCapacity: result.data[0].cat2_percentage,
        aboveCapacity: result.data[0].cat3_percentage,
      }));

      formattedSummaries.sort((a, b) => a.belowCapacity - b.belowCapacity);

      formattedSummaries.forEach((summary, index) => {
        summary.ranking = index + 1;
      });

      setProvinceSummaries(formattedSummaries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching province summaries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinceIds();
  }, []);

  useEffect(() => {
    if (provinceIds.length > 0) {
      fetchProvinceSummaries();
    }
  }, [provinceIds]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData: { [key: string]: LivestockData[] } = {};
        await Promise.all(
          livestockTypes.map(async (type) => {
            const response = await fetch(`http://localhost:8080/api/provincebyclass/${type}`);
            const json_object = await response.json();
            const formattedData = [{
              aimag: type,
              data: json_object.data.map((item: any) => ({
                x: item.year,
                y: item.livestock_count
              }))
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

    fetchData();
  }, []);

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
            Key conclusions
          </Typography>

          <Box sx={{p: 4, borderRadius: 2 }}>
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
              mb: 3,
              '& .MuiTabs-root': {
                minHeight: '48px',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: '48px',
              }
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
              rows={provinceSummaries}
              loading={loading}
            />
          </Box>

          <Box sx={{p: 4, borderRadius: 2 }}>
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
