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
        <TextField {...params} label={label} variant="outlined" sx={sx} />
      )}
      freeSolo
      disableClearable
    />
  );
};

export default Dropdown;
