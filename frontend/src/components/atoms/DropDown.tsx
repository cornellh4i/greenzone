import React from "react";
import { Autocomplete, TextField } from "@mui/material";

interface DropdownProps {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  sx?: React.CSSProperties;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  sx,
}) => {
  console.log("Dropdown received options:", options);
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.toString()}
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string" || newValue === null) {
          onChange(newValue);
        }
      }}
      /*renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: "flex", flexDirection: "column", padding: "10px" }}>
          <Typography sx={{ fontWeight: "bold", color: "black" }}>
            {option} 
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "darkblue" }}>
            {countyMap[option]?.province_name || ""}
          </Typography>
        </Box>
      )}*/
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box component="li" key={key} {...restProps} sx={{ display: "flex", flexDirection: "column", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold", color: "black" }}>
              {option}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "darkblue" }}>
              {countyMap[option]?.province_name || ""}
            </Typography>
          </Box>
        );
      }}
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