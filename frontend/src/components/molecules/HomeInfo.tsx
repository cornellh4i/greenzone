import React from "react";
import { Box, Button, SxProps, Theme } from "@mui/material";
// components/LeftRightSection.tsx

interface LeftRightSectionProps {
  containerSx?: SxProps<Theme>;
  bgColor?: string;
  paddingY?: number;
  maxWidth?: string | number;
  gap?: number;
  reverseOnDesktop?: boolean;

  left: React.ReactNode;
  right: React.ReactNode;

  buttonText?: string;
  onButtonClick?: () => void;
  buttonVariant?: "text" | "outlined" | "contained";
  buttonColor?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
  buttonSide?: "left" | "right";
  buttonSx?: SxProps<Theme>;
  gridSx?: SxProps<Theme>;
}

export const LeftRightSection: React.FC<LeftRightSectionProps> = ({
  containerSx = {},
  bgColor = "white",
  paddingY = 8,
  maxWidth = "lg",
  gap = 4,
  reverseOnDesktop = false,
  left,
  right,
  buttonText,
  onButtonClick,
  buttonVariant = "outlined",
  buttonColor = "primary",
  buttonSide = "left",
  buttonSx = {},
  gridSx = {},
}) => (
  <Box
    sx={{
      py: paddingY,
      backgroundColor: bgColor,
      ...containerSx,
    }}
  >
    <Box
      sx={{
        maxWidth,
        mx: "auto",
        px: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap,
        alignItems: "center",
        ...gridSx,
      }}
    >
      <Box sx={{ order: { xs: 1, md: reverseOnDesktop ? 2 : 1 } }}>
        {left}
        {buttonText && buttonSide === "left" && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant={buttonVariant}
              color={buttonColor}
              onClick={onButtonClick}
              sx={{
                ...buttonSx,
              }}
            >
              {buttonText}
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ order: { xs: 2, md: reverseOnDesktop ? 1 : 2 } }}>
        {right}
        {buttonText && buttonSide === "right" && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant={buttonVariant}
              color={buttonColor}
              onClick={onButtonClick}
              sx={buttonSx}
            >
              {buttonText}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  </Box>
);

export default LeftRightSection;
