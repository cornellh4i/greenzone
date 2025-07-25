import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Box, Typography } from "@mui/material";

interface CountyOption {
  entity_id: number;
  entity_name: string;
  entity_type: string;
  entity_sub_id: number | null;
  entity_sub_name: string | null;
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

  sx,
}) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.entity_name
      }
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
        } else {
          onChange({
            entity_id: newValue.entity_id,
            entity_name: newValue.entity_name,
            entity_type: newValue.entity_type,
            entity_sub_id: newValue.entity_sub_id,
            entity_sub_name: newValue.entity_sub_name,
          });
        }
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.entity_id}
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
            {option.entity_name}
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
            {option.entity_type == "Soum"
              ? `Soum • ${option.entity_sub_name}`
              : "Aimag"}
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
