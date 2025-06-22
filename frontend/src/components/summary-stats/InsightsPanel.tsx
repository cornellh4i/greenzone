import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Tabs, Tab } from "@mui/material";
import LineGraph from "../charts/line-graph";
import Table from "../charts/Table";
import { backendUrl } from "../../utils/const";

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
  const [livestockData, setLivestockData] = useState<{
    [key: string]: LivestockData[];
  }>({});
  const [provinceSummaries, setProvinceSummaries] = useState<SummaryData[]>([]);
  const [countySummaries, setCountySummaries] = useState<SummaryData[]>([]);
  const [provinceIds, setProvinceIds] = useState<number[]>([]);
  const [countyIds, setCountyIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [counties, setCounties] = useState<any[]>([]);

  const livestockTypes = ["cattle", "horse", "goat", "camel", "sheep"];
  const dzudYears = [2017, 2016, 2020, 2021];
  const privatizationPeriods = [2012, 2015, 2018, 2013];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  const tableColumns = [
    { field: "ranking", headerName: "Ranking", width: 100 },
    {
      field: "name",
      headerName: tabValue === 0 ? "Aimag" : "Soum",
      width: 200,
    },
    ...(tabValue === 1
      ? [{ field: "aimag", headerName: "Aimag", width: 200 }]
      : []),
    {
      field: "belowCapacity",
      headerName: "Below Capacity",
      width: 150,
      format: (value: number) => `${value}%`,
    },
    {
      field: "atCapacity",
      headerName: "At Capacity",
      width: 150,
      format: (value: number) => `${value}%`,
    },
    {
      field: "aboveCapacity",
      headerName: "Above Capacity",
      width: 150,
      format: (value: number) => `${value}%`,
    },
  ];

  const fetchProvinceIds = async () => {
    try {
      const response = await fetch(`${backendUrl}/province`);
      const json = await response.json();
      if (json.data) {
        setProvinceIds(json.data.map((province: any) => province.id));
        setProvinces(json.data);
      }
    } catch (error) {
      console.error("Error fetching province IDs:", error);
    }
  };

  const fetchCountyIds = async () => {
    try {
      const response = await fetch(`${backendUrl}/county`);
      const json = await response.json();
      if (json.data) {
        setCountyIds(json.data.map((county: any) => county.id));
        setCounties(json.data);
      }
    } catch (error) {
      console.error("Error fetching county IDs:", error);
    }
  };

  const getProvinceNameById = (id: number): string => {
    const province = provinces.find((p) => p.id === id);
    return province?.name ?? "Unknown Province";
  };

  const getSoumNameById = (id: number): string => {
    const county = counties.find((c) => c.id === id);
    return county?.name ?? "Unknown Soum";
  };

  const getProvinceNameFromCountyId = (id: number): string => {
    const county = counties.find((c) => c.id === id);
    return county?.province_name ?? "Unknown Province";
  };

  const fetchSummariesFromIds = async (
    ids: number[],
    entityType: "province" | "county",
    setSummaries: React.Dispatch<React.SetStateAction<SummaryData[]>>
  ) => {
    try {
      setLoading(true);
      const promises: Promise<{ entityID: number; data: any } | null>[] =
        ids.map(async (entityID) => {
          try {
            const response = await fetch(
              `${backendUrl}/cell/${entityType}/${entityID}/carrying_capacity/2022`
            );
            const data = await response.json();
            return { entityID, data };
          } catch (error) {
            console.error(
              `Error fetching data for ${entityType} ID ${entityID}:`,
              error
            );
            return null;
          }
        });

      const results = await Promise.all(promises);
      console.log(results);
      const validResults = results.filter(
        (result): result is { entityID: number; data: any } =>
          result !== null && result.data && result.data.length > 0
      );
      console.log("Valid Results:", validResults);
      const formattedSummaries = results.map((result, index) => {
        const record = result?.data.data[0];
        const id = result?.entityID;

        if (id) {
          const name =
            entityType === "province"
              ? getProvinceNameById(id)
              : getSoumNameById(id);
          const aimag =
            entityType === "province" ? "" : getProvinceNameFromCountyId(id);
          return {
            ranking: index + 1,
            name,
            aimag,
            belowCapacity: record?.cat1 ?? 0,
            atCapacity: record?.cat2 ?? 0,
            aboveCapacity: record?.cat3 ?? 0,
          };
        } else {
          return {
            ranking: index + 1,
            name: "Unknown",
            aimag: "",
            belowCapacity: 0,
            atCapacity: 0,
            aboveCapacity: 0,
          };
        }
      });

      console.log("Formatted Summaries:", formattedSummaries);
      formattedSummaries.sort((a, b) => {
        if (b.aboveCapacity !== a.aboveCapacity) {
          return b.aboveCapacity - a.aboveCapacity; // Descending
        } else if (b.atCapacity !== a.atCapacity) {
          return b.atCapacity - a.atCapacity; // Descending
        } else {
          return a.belowCapacity - b.belowCapacity; // Ascending
        }
      });
      formattedSummaries.forEach(
        (summary, index) => (summary.ranking = index + 1)
      );

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
            const response = await fetch(
              `${backendUrl}/provincebyclass/${type}`
            );
            const json = await response.json();
            const formattedData = [
              {
                aimag: type,
                data: json.data.map((item: any) => ({
                  x: item.year,
                  y: item.livestock_count,
                })),
              },
            ];
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
    <Box sx={{ backgroundColor: "#F3F4F6", py: 8 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#111827", mb: 4 }}
          >
            Key Conclusions
          </Typography>

          <Box sx={{ p: 4, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#111827", mb: 3 }}
            >
              Regions by Carrying Capacity & Breakdown
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  "& .Mui-selected": { color: "#2563EB" },
                  "& .MuiTabs-indicator": { backgroundColor: "#2563EB" },
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
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#111827", mb: 3 }}
            >
              Livestock Population by Type and Year
            </Typography>
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                mx: -4,
                px: 4,
                "& > div": {
                  minWidth: "1500px",
                  width: "100%",
                  height: "600px",
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
