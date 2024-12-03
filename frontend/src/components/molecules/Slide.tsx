import React, { useState } from "react";
import { Slider, Box } from "@mui/material";
import Dropdown from "../atoms/DropDown";

interface SlideProps {
  name: string; // Custom name for the slider (e.g., "Year")
  selectedValue: number | null;
  onChange: (value: number) => void; // Accepts a number
  min: number; // Minimum value of the slider range
  max: number; // Maximum value of the slider range
  options?: string[];
}

const Slide: React.FC<SlideProps> = ({
  name,
  selectedValue,
  onChange,
  min,
  max,
  options,
}) => {
  const [value, setValue] = useState<number>(selectedValue || max);

  const handleSlideChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue); // Update local state
      onChange(newValue); // Call the onChange handler passed from parent
    }
  };

  const handleDropdownChange = (newValue: number | null) => {
    if (newValue !== null) {
      setValue(newValue);
      onChange(newValue);
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
            {<Dropdown
        options={options}
        value={value.toString()}
        onChange={handleDropdownChange}
        sx={{ width: "64px", alignItems: 'center' }}
        disableClearable={true}/>}
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
      <Box display="flex" width="100%" justifyContent="space-between" mt={2}>
        <span
          style={{
            fontFamily: "Poppins",
            fontSize: "14px",
            lineHeight: "5px",
            textAlign: "left",
            color: "black",
          }}
        >
          {min}
        </span>
        <span
          style={{
            fontFamily: "Poppins",
            fontSize: "14px",
            lineHeight: "5px",
            textAlign: "right",
            color: "black",
          }}
        >
          {max}
        </span>
      </Box>
    </Box>
  );
};

export default Slide;
