import React from "react";
import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import data from "@/components/charts/data/mongolia-province-data.json";
import { extractData, groupByLivestockAndYear, extractYearRange, createMultipleDatasets } from "@/utils/helpers";
import { Mongolia } from "@/pages/about";


interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, children }) =>
  {
    const organizedData: Mongolia = data;

    const extractedDataWithKeys = extractData(organizedData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const goats = createMultipleDatasets(extractedDataWithKeys, "Goat");
  
    const yearRange = Array.from(extractYearRange(extractedDataWithKeys)).sort(
      (a, b) => a - b
    );

    
    const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];

    const [selectedAimag, setSelectedAimag] = useState<string | null>(null);

    const [filteredData, setFilteredData] = useState<any[]>([]);

    const [selectedYear, setSelectedYear] = useState<number | null>(
      Math.max(...yearRange)
    );

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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
    


  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setSelectedAimag(null);
  }
  
  
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
    <Drawer anchor="left" open={isOpen} onClose={onClose}PaperProps={{
        sx: {width: '80%', maxWidth: '550px', boxSizing: "border-box",
          p: 2, display: "flex", flexDirection: "column"},}}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <Button
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          Close
        </Button>
        <Box sx={{ mt: 6 }}>{children}</Box>
      </Box>
    </Drawer>
  );
};

export default SidePanel;
