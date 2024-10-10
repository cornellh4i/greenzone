import React from "react";
import { Button as MuiButton } from "@mui/material";

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <MuiButton variant="contained" onClick={onClick}>
      {label}
    </MuiButton>
  );
};

export default Button;
