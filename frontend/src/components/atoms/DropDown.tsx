import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Box, Typography } from "@mui/material";

interface DropdownProps {
  options: string[];
  countyMap: { [key: string]: { county_id: number; province_name: string } };
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  sx?: React.CSSProperties;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  countyMap,
  value,
  onChange,
  label,
  sx,
}) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.toString()}
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string" || newValue === null) {
          onChange(newValue);
          console.log("user typed " + newValue);
        }
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: "flex", flexDirection: "column", padding: "10px" }}>
          <Typography sx={{ fontWeight: "bold", color: "black" }}>
            {option} {/* County Name */}
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "darkblue" }}>
            {countyMap[option]?.province_name || ""}
          </Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
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
