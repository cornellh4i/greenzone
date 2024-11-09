import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import SearchBar from "@/components/molecules/SearchBar";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer } from "@mui/material";

const SidePain = () => {
  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];
  const yearRange = [2002, 2003, 2024]; // example year range
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);

  const loadProvince = async () => {
    try {
      const provinces = await fetch("http://localhost:8080/api/province");
      const json_object = await provinces.json();
      console.log(json_object); // should see the province data logged in console
      // get the province of interest- must be provided

      // get the year of interest- doesn't have to be provided(defaults to latest year)

      // gather data for each animal for the province for that Year

      // Set the filteredData state variable
      // should look something like [{aimag:<name_of_aimag> , data:[{x:'Cattle', y: 86}, {x:'Horse', y: 45} ... {x:'Sheep', y:90}]}] so that the bargraph.tsx component can recognize the input.
    } catch (error) {
      console.error("Error fetching data from Express:", error);
    }
  };

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setSelectedAimag(null);
  }; // handles opening the sidepanel and closing it

  const handleProvinceSearch = (aimag: string | null) => {
    //set the province state variable depending on what the user searches
  };

  const handleYearSlider = (year: number | null) => {
    //set the year state variable depending on what the user inputs
  };

  //useEffect to fetch the data and then display
  useEffect(() => {
    handleProvinceSearch(selectedAimag);

    handleYearSlider(selectedYear);

    loadProvince();
  }, []);

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
                ></Button>
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
                    <input // make a slider for the year, adjust the props
                      type="range"
                      min={Math.min(...yearRange)}
                      max={Math.max(...yearRange)}
                      value={selectedYear}
                      onChange={handleYearSlider}
                      aria-label="Select a year"
                    />
                  </div>
                </div>
                {selectedAimag &&
                  filteredData.length > 0 && ( // if there's actual data show bar chart
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
