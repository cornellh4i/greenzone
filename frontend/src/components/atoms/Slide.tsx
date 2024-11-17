import React, { useState } from "react";
import { Slider, Box } from "@mui/material";

interface SlideProps {
  name: string; // Custom name for the slider (e.g., "Year")
  selectedValue: number | null;
  onChange: (value: number) => void; // Accepts a number
  min: number; // Minimum value of the slider range
  max: number; // Maximum value of the slider range
}

const Slide: React.FC<SlideProps> = ({
  name,
  selectedValue,
  onChange,
  min,
  max,
}) => {
  const [value, setValue] = useState<number>(selectedValue || min); // Local state for the slider value

  const handleSlideChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue); // Update local state
      onChange(newValue); // Call the onChange handler passed from parent
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
      <Box
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <span
          style={{
            fontFamily: "Poppins",
            fontSize: "20px",
            fontWeight: "600",
            lineHeight: "28.6px",
            letterSpacing: "0.17px",
            textAlign: "left",
            textDecoration: "none",
          }}
        >
          {" "}
          {name}
        </span>
        <Box
          ml={2}
          p={1}
          bgcolor="grey.300"
          borderRadius="4px"
          display="inline-block"
          width="auto"
        >
          <span
            style={{
              fontFamily: "Poppins",
              fontSize: "20px",
              fontWeight: "600",
              lineHeight: "28.6px",
              letterSpacing: "0.17px",
              textAlign: "left",
              textDecoration: "none",
            }}
          >
            {value}
          </span>
        </Box>
      </Box>
      <Slider
        value={value}
        min={min}
        max={max}
        onChange={handleSlideChange}
        valueLabelDisplay="auto"
      />
    </Box>
  );
};

export default Slide;
