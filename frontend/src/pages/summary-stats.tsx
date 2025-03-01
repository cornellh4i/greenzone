import React, { useState, useEffect } from "react";
import LineGraph from "../components/charts/line-graph";

interface LivestockData {
  aimag: string;
  data: { x: number; y: number }[];
}

const SummaryStatistics: React.FC = () => {
  const [livestockData, setLivestockData] = useState<{[key: string]: LivestockData[]}>({});
  const livestockTypes = ["cattle", "horse", "goat", "camel", "sheep"];
  const dzudYears = [2017, 2016, 2020, 2021]; 
  const privatizationPeriods = [2012, 2015, 2018, 2013];

  useEffect(() => {
    const fetchAllLivestockData = async () => {
      try {
        const allData: {[key: string]: LivestockData[]} = {};
        
        // Fetch data for all livestock types
        await Promise.all(
          livestockTypes.map(async (type) => {
            const response = await fetch(
              `http://localhost:8080/api/provincebyclass/${type}`
            );
            const json_object = await response.json();
            console.log(`Raw API response for ${type}:`, json_object);
            
            // Transform the data to match the format needed for the graph
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

        console.log('All formatted data:', allData);
        setLivestockData(allData);
      } catch (error) {
        console.error("Error fetching livestock data:", error);
      }
    };

    fetchAllLivestockData();
  }, []); // Only fetch once on component mount

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
    </div>
  );
};

export default SummaryStatistics;