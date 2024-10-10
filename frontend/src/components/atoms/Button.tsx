import React from "react";
import { Button as MuiButton, SxProps } from "@mui/material";

interface ButtonProps {
  onClick: () => void;
  label: string;
  sx?: SxProps;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, sx, disabled }) => {
  return (
    <MuiButton variant="contained" onClick={onClick} sx={sx} disabled={disabled}>
      {label}
    </MuiButton>
  );
};

export default Button;
