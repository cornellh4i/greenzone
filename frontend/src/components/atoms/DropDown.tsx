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