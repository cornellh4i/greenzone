import React from "react";
import { Slider, Box, Typography } from "@mui/material";

interface SlideProps {
  selectedYear: number | null;
  onChange: (year: string) => void;
}

const Slide: React.FC<SlideProps> = ({ selectedYear, onChange }) => {
  const handleSlideChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      onChange(newValue.toString());
    }
  };

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Typography variant="h6" mr={2}>
        Year
      </Typography>
      <Slider
        value={selectedYear || 2024}
        min={2007}
        max={2024}
        onChange={handleSlideChange}
        valueLabelDisplay="auto"
      />
      <Box ml={2} p={1} bgcolor="grey.300" borderRadius="4px">
        <Typography>{selectedYear}</Typography>
      </Box>
    </Box>
  );
};

export default Slide;