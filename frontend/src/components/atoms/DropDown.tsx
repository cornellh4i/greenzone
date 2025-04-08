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
      value={value ? value : ""}
      onChange={(event, newValue) => {
        if (typeof newValue === "string" || newValue === null) {
          onChange(newValue);
        }
      }}
      renderOption={(props, option) => (
        <li
          {...props}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "400",
            fontSize: "14px",
            justifyContent: "center",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            verticalAlign: "middle",
          }}
        >
          {option}
        </li>
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
              fontWeight: "bold",
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0.15px",
              height: "35px",
              textAlign: "center",
              "& input": {
                textAlign: "center",
                padding: "8px 12px",
                verticalAlign: "middle",
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
