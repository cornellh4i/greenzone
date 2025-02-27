import React from "react";
import { Button as MuiButton, SxProps } from "@mui/material";

interface ButtonProps {
  onClick: () => void;
  label?: string;
  sx?: SxProps;
  disabled?: boolean;
  startIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, sx, disabled, startIcon }) => {
  return (
    <MuiButton variant="contained" onClick={onClick} sx={sx} disabled={disabled} startIcon={startIcon}>
      {label}
    </MuiButton>
  );
};

export default Button;
