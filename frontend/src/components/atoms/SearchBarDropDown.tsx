import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Box, Typography } from "@mui/material";

interface DropdownProps {
  options: {
    county_id: number;
    county_name: string;
    province_name: string;
  }[];
  value:
    | {
        county_id: number;
        county_name: string;
        province_name: string;
      }
    | undefined;

  onChange: (selectedItem: {
    county_id: number;
    county_name: string;
    province_name: string;
  }) => void;
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
  console.log(options);
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.county_name
      }
      value={value || null}
      onChange={(event, newValue) => {
        console.log("User selected:", newValue.county_name);
        onChange({
          county_id: newValue.county_id,
          county_name: newValue.county_name,
          province_name: newValue.province_name,
        });
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.county_id}
          sx={{ display: "flex", flexDirection: "column", padding: "10px" }}
        >
          <Typography sx={{ fontWeight: "bold", color: "black" }}>
            {option.county_name} {/* County Name */}
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "darkblue" }}>
            {option.province_name}
          </Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Select Option"}
          variant="outlined"
          sx={{
            ...sx,
            "& .MuiOutlinedInput-root": {
              borderRadius: sx?.borderRadius || "20px",
              color: sx?.color || "black",
              fontWeight: sx?.fontWeight || "bold",
              fontFamily: sx?.fontFamily || "Arial, sans-serif",
              textAlign: "center",
              "& input": {
                textAlign: "center",
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
