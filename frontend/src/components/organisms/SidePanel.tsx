import React from "react";
import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import data from "@/components/charts/data/mongolia-province-data.json";
import {
  extractData,
  groupByLivestockAndYear,
  extractYearRange,
  createMultipleDatasets,
} from "@/utils/helpers";
import { Mongolia } from "@/utils/interfaces";
import DropDown from "@/components/atoms/DropDown";
import SearchBar from "@/components/molecules/SearchBar";
import BarChart from "@/components/charts/barchart";

const SidePanel = () => {
  const organizedData: Mongolia = data;

  const extractedDataWithKeys = extractData(organizedData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goats = createMultipleDatasets(extractedDataWithKeys, "Goat");

  const yearRange = Array.from(extractYearRange(extractedDataWithKeys)).sort(
    (a, b) => a - b
  );

  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];

  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [selectedYear, setSelectedYear] = useState<number | null>(
    Math.max(...yearRange)
  );

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setSelectedAimag(null);
  };

  const handleSearchResult = (aimag: string | null) => {
    if (aimag) {
      setSelectedAimag(aimag);
      const yearToUse = selectedYear || Math.max(...yearRange);

      const filtered = groupByLivestockAndYear(
        yearToUse,
        livestockTypes,
        extractedDataWithKeys.filter(
          (dataset) =>
            dataset.Aimag === aimag && dataset.Year.includes(yearToUse)
        )
      );
      setFilteredData(filtered);
    } else {
      setSelectedAimag(null);
      setFilteredData([]);
    }
  };

  const selectedOption: string | null = null;

  const handleYearChange = (year: string | null) => {
    if (year) {
      const yearAsNumber = Number(year);
      setSelectedYear(yearAsNumber);
      const aimagToUse = selectedAimag;

      const filtered = groupByLivestockAndYear(
        yearAsNumber,
        livestockTypes,
        extractedDataWithKeys.filter(
          (dataset) =>
            (!aimagToUse || dataset.Aimag === aimagToUse) &&
            dataset.Year.includes(yearAsNumber)
        )
      );
      setFilteredData(filtered);
    } else {
      setSelectedYear(null);
      setFilteredData([]);
    }
  };

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
                    <SearchBar onSearch={handleSearchResult} />
                  </div>
                </div>
                {/* <ScatterLinePlot datasets={goats} livestock={"Goats"} /> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ flex: 11, marginRight: "1rem" }}>
                    <DropDown
                      options={yearRange.map((year) => year.toString())}
                      value={selectedOption}
                      onChange={handleYearChange}
                      label="Select a year"
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

export default SidePanel;
