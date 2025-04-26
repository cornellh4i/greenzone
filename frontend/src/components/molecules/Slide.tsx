import React, { useState, useEffect } from "react";
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
  options = [],
}) => {
  const [sliderVal, setSliderVal] = useState<number>(selectedValue || max);

  useEffect(() => {
    if (selectedValue !== null) {
      setSliderVal(selectedValue);
    }
  }, [selectedValue]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setSliderVal(newValue); // Update local state
    }
  };

  // Handles when releasing the slider
  const handleSliderCommit = (
    _: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    if (typeof newValue === "number") {
      setSliderVal(newValue); // Update local state
      onChange(newValue); // Also notify parent component
    }
  };

  const handleDropdownChange = (newValue: number | null) => {
    if (newValue !== null) {
      setSliderVal(newValue);
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
        <Box ml={2} p={1} display="inline-block" width="auto">
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
          ></span>{" "}
          {
            <Dropdown
              options={options}
              value={sliderVal.toString()}
              onChange={(newVal) => handleDropdownChange(Number(newVal))}
              sx={{
                width: "80px",
                backgroundColor: "white",
                fontSize: "8px",
                color: "black",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: "10px",
              }}
              label={""}
            />
          }
        </Box>
      </Box>
      <Slider
        id="myRange"
        value={sliderVal}
        min={min}
        max={max}
        onChange={handleSliderChange} // Call when dragging slider
        onChangeCommitted={handleSliderCommit} //Call once finished dragging slider
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
