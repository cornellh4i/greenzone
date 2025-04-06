import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Box, Typography } from "@mui/material";

interface CountyOption {
  county_id: number;
  county_name: string;
  province_name: string;
  province_id: number;
}
interface DropdownProps {
  options: CountyOption[];
  value: CountyOption | undefined;
  onChange: (selectedItem: CountyOption) => void;
  onInputChange: (inputValue: string) => void;
  sx?: React.CSSProperties;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  onInputChange,
  sx,
}) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.county_name
      }
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
        } else {
          onChange({
            county_id: newValue.county_id,
            county_name: newValue.county_name,
            province_name: newValue.province_name,
            province_id: newValue.province_id,
          });
        }
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.county_id}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "300",
              fontSize: "17.5px",
              lineHeight: "150%",
              letterSpacing: "0.18px",
              color: "black",
              textAlign: "left",
              width: "100%",
            }}
          >
            {option.county_name}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "250",
              fontSize: "13px",
              lineHeight: "140%",
              letterSpacing: "0.16px",
              color: "grey",
              textAlign: "left",
              width: "100%",
            }}
          >
            Soum * {option.province_name}
          </Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Search for aimag, soum"}
          variant="outlined"
          sx={{
            ...sx,
            "& .MuiOutlinedInput-root": {
              borderRadius: sx?.borderRadius || "20px",
              fontFamily: "Poppins, sans-serif",
              fontWeight: "300",
              width: "100%",
              minWidth: "300px",
              fontSize: "17px",
              lineHeight: "150%",
              letterSpacing: "0.18px",
              verticalAlign: "middle",
              color: "black",
              textAlign: "left",
              "& input": {
                fontFamily: "Poppins, sans-serif",
                fontWeight: "300",
                fontSize: "17px",
                lineHeight: "150%",
                letterSpacing: "0.18px",
              },
            },
            "& .MuiInputLabel-root": {
              color: "grey",
              fontWeight: "bold",
              fontFamily: sx?.fontFamily || "Arial, sans-serif",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey",
            },
          }}
        />
      )}
      freeSolo
      disableClearable
    />
  );
};

export default Dropdown;
