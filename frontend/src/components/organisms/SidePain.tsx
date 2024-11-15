import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer } from "@mui/material";

const SidePain = () => {
  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];
  const yearRange = [
    2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
    2014,
  ]; // Full year range
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    Math.max(...yearRange)
  ); // Default to the latest year
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);

  // Fetch data for a specific aimag and year
  const loadProvince = async (aimag: string, year: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/province/${aimag}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch province data");
      }
      const data = await response.json();

      // Transform data into the format required by BarChart
      const transformedData = livestockTypes.map((type) => ({
        x: type,
        y: data[`province_number_of_${type.toLowerCase()}`]?.[year] || 0, // Default to 0 if no data for the year
      }));

      // Update filteredData state
      setFilteredData([
        {
          aimag: data.province_name,
          data: transformedData,
        },
      ]);
    } catch (error) {
      console.error("Error fetching province data:", error);
      setFilteredData([]); // Reset data on error
    }
  };

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setSelectedAimag(null);
    setFilteredData([]);
  };

  const handleProvinceSearch = (aimag: string | null) => {
    setSelectedAimag(aimag);
    if (aimag && selectedYear) {
      loadProvince(aimag, selectedYear); // Fetch data when both aimag and year are set
    }
  };

  const handleYearSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = Number(event.target.value);
    setSelectedYear(year);
    if (selectedAimag) {
      loadProvince(selectedAimag, year); // Fetch data when both aimag and year are set
    }
  };

  useEffect(() => {
    if (selectedAimag && selectedYear) {
      loadProvince(selectedAimag, selectedYear); // Fetch data initially if values are set
    }
  }, [selectedAimag, selectedYear]);

  return (
    <div>
      <Button onClick={handlePanelToggle} label="Toggle SidePanel" />
      {isPanelOpen && (
        <div>
          <Drawer
            anchor="left"
            open={isPanelOpen}
            onClose={handlePanelToggle}
            PaperProps={{
              sx: {
                width: "80%",
                maxWidth: "550px",
                boxSizing: "border-box",
                p: 2,
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Box sx={{ position: "relative", width: "100%" }}>
              <div>
                <Button
                  onClick={handlePanelToggle}
                  label="Close"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                />
              </div>

              <div style={{ marginTop: "60px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: 11, marginRight: "1rem" }}>
                    <SearchBar onSearch={handleProvinceSearch} />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ flex: 11, marginRight: "1rem" }}>
                    <label>Select a Year: {selectedYear}</label>
                    <input
                      type="range"
                      min={Math.min(...yearRange)}
                      max={Math.max(...yearRange)}
                      value={selectedYear}
                      onChange={handleYearSlider}
                      aria-label="Select a year"
                    />
                  </div>
                </div>

                {selectedAimag && filteredData.length > 0 && (
                  <div>
                    <BarChart
                      datasets={filteredData}
                      livestock={livestockTypes}
                    />
                  </div>
                )}
              </div>
            </Box>
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default SidePain;
