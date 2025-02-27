import React from "react";
import { TextField } from "@mui/material";

interface TextBoxProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
}

const TextBox: React.FC<TextBoxProps> = ({ value, onChange, label }) => {
  return (
    <TextField
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      variant="outlined"
      fullWidth
    />
  );
};

export default TextBox;
