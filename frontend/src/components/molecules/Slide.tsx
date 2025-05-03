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

const CalendarIcon = () => (
  <svg width="25" height="40" viewBox="0 -14 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.4023 4.14111C12.1802 4.14111 12.8086 4.76953 12.8086 5.54736V6.95361H18.4336V5.54736C18.4336 4.76953 19.062 4.14111 19.8398 4.14111C20.6177 4.14111 21.2461 4.76953 21.2461 5.54736V6.95361H23.3555C24.52 6.95361 25.4648 7.89844 25.4648 9.06299V11.1724H5.77734V9.06299C5.77734 7.89844 6.72217 6.95361 7.88672 6.95361H9.99609V5.54736C9.99609 4.76953 10.6245 4.14111 11.4023 4.14111ZM5.77734 12.5786H25.4648V24.5317C25.4648 25.6963 24.52 26.6411 23.3555 26.6411H7.88672C6.72217 26.6411 5.77734 25.6963 5.77734 24.5317V12.5786ZM8.58984 16.0942V17.5005C8.58984 17.8872 8.90625 18.2036 9.29297 18.2036H10.6992C11.0859 18.2036 11.4023 17.8872 11.4023 17.5005V16.0942C11.4023 15.7075 11.0859 15.3911 10.6992 15.3911H9.29297C8.90625 15.3911 8.58984 15.7075 8.58984 16.0942ZM14.2148 16.0942V17.5005C14.2148 17.8872 14.5312 18.2036 14.918 18.2036H16.3242C16.7109 18.2036 17.0273 17.8872 17.0273 17.5005V16.0942C17.0273 15.7075 16.7109 15.3911 16.3242 15.3911H14.918C14.5312 15.3911 14.2148 15.7075 14.2148 16.0942ZM20.543 15.3911C20.1562 15.3911 19.8398 15.7075 19.8398 16.0942V17.5005C19.8398 17.8872 20.1562 18.2036 20.543 18.2036H21.9492C22.3359 18.2036 22.6523 17.8872 22.6523 17.5005V16.0942C22.6523 15.7075 22.3359 15.3911 21.9492 15.3911H20.543ZM8.58984 21.7192V23.1255C8.58984 23.5122 8.90625 23.8286 9.29297 23.8286H10.6992C11.0859 23.8286 11.4023 23.5122 11.4023 23.1255V21.7192C11.4023 21.3325 11.0859 21.0161 10.6992 21.0161H9.29297C8.90625 21.0161 8.58984 21.3325 8.58984 21.7192ZM14.918 21.0161C14.5312 21.0161 14.2148 21.3325 14.2148 21.7192V23.1255C14.2148 23.5122 14.5312 23.8286 14.918 23.8286H16.3242C16.7109 23.8286 17.0273 23.5122 17.0273 23.1255V21.7192C17.0273 21.3325 16.7109 21.0161 16.3242 21.0161H14.918ZM19.8398 21.7192V23.1255C19.8398 23.5122 20.1562 23.8286 20.543 23.8286H21.9492C22.3359 23.8286 22.6523 23.5122 22.6523 23.1255V21.7192C22.6523 21.3325 22.3359 21.0161 21.9492 21.0161H20.543C20.1562 21.0161 19.8398 21.3325 19.8398 21.7192Z" fill="black" />
  </svg>

)

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
    <Box display="flex" flexDirection="column" alignItems="flex-start" mb={2} style={{ fontFamily: "Poppins, sans-serif" }}>
      <Box
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "20px",
            fontWeight: "600",
            lineHeight: "28.6px",
            letterSpacing: "0.17px",
            textAlign: "left",
            textDecoration: "none",
          }}
        >
          <CalendarIcon />
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
        sx={{
          '& .MuiSlider-thumb': {
            color: '#065143',
          },
          '& .MuiSlider-track': {
            color: '#065143',
          },
          '& .MuiSlider-rail': {
            color: '#8F8F8F', // Lighter red for the rail
          }
        }}
      />
      <Box display="flex" width="100%" justifyContent="space-between" mt={2}>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            lineHeight: "0px",
            textAlign: "left",
            color: "black",
          }}
        >
          {min}
        </span>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            lineHeight: "0px",
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
