import React, { useState, useEffect } from "react";
import LineGraph from "../components/charts/line-graph";
import Table from "../components/charts/Table";

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

const SummaryStatistics: React.FC = () => {
  const [livestockData, setLivestockData] = useState<{[key: string]: LivestockData[]}>({});
  const [provinceSummaries, setProvinceSummaries] = useState<ProvinceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  const livestockTypes = ["cattle", "horse", "goat", "camel", "sheep"];
  const dzudYears = [2017, 2016, 2020, 2021];
  const privatizationPeriods = [2012, 2015, 2018, 2013];

  const tableColumns = [
    { 
      field: 'ranking', 
      headerName: 'Ranking', 
      width: 100,
      format: (value: number) => value.toString()
    },
    { 
      field: 'aimag', 
      headerName: 'Aimag', 
      width: 200 
    },
    { 
      field: 'belowCapacity', 
      headerName: 'Below Capacity', 
      width: 150,
      format: (value: number) => `${value}%`
    },
    { 
      field: 'atCapacity', 
      headerName: 'At Capacity', 
      width: 150,
      format: (value: number) => `${value}%`
    },
    { 
      field: 'aboveCapacity', 
      headerName: 'Above Capacity', 
      width: 150,
      format: (value: number) => `${value}%`
    },
  ];

  const fetchProvinceSummaries = async () => {
    try {
      setLoading(true);
      const promises = [];
      
      // Fetch data for all provinces (11-85 as per backend validation)
      for (let provinceId = 11; provinceId <= 85; provinceId++) {
        promises.push(
          fetch(`http://localhost:8080/api/${provinceId}/carrying_capacity/cell-summary`)
            .then(response => response.json())
            .catch(error => {
              console.error(`Error fetching data for province ${provinceId}:`, error);
              return null;
            })
        );
      }

      const results = await Promise.all(promises);
      const validResults = results.filter(result => result && result.data && result.data.length > 0);
      
      const formattedSummaries = validResults.map((result, index) => ({
        ranking: index + 1,
        aimag: result.data[0].province_name,
        belowCapacity: result.data[0].cat1_percentage,
        atCapacity: result.data[0].cat2_percentage,
        aboveCapacity: result.data[0].cat3_percentage,
      }));

      // Sort by belowCapacity percentage (as shown in the image)
      formattedSummaries.sort((a, b) => a.belowCapacity - b.belowCapacity);
      
      // Update rankings after sorting
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
    const fetchData = async () => {
      try {
        // Fetch livestock data
        const allData: {[key: string]: LivestockData[]} = {};
        await Promise.all(
          livestockTypes.map(async (type) => {
            const response = await fetch(
              `http://localhost:8080/api/provincebyclass/${type}`
            );
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

        // Fetch province summaries
        await fetchProvinceSummaries();
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="summary-statistics">
      <h1>Livestock Population Over Time</h1>
      
      {Object.keys(livestockData).length > 0 && (
        <LineGraph
          datasets={Object.values(livestockData).flat()}
          livestock="all"
          dzudYears={dzudYears}
          privatizationPeriods={privatizationPeriods}
        />
      )}

      <h2>Province Capacity Summary</h2>
      <Table
        columns={tableColumns}
        rows={provinceSummaries}
        loading={loading}
      />
    </div>
  );
};

export default SummaryStatistics;