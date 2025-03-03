import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Props for the SidePanelPercentageModal
 */
interface SidePanelPercentageModalProps {
  /** Controls whether the section is visible or not */
  isOpen: boolean;
  /** True => Carrying Capacity; False => Z-Score */
  classificationType: boolean;
  /** Numerical values (e.g., percentages) to display */
  classificationValues: number[];
  /** Labels for each classification category (e.g., "Below Capacity", "At Capacity", "Over Capacity") */
  classificationLabels: string[];
  /** Colors corresponding to each label */
  classificationColourScheme: string[];
}

/**
 * SidePanelPercentageModal:
 * A flexible, MUI-styled section that adapts to the length of classificationValues,
 * classificationLabels, etc. Rendered at the bottom of the side panel.
 */
const SidePanelPercentageModal: React.FC<SidePanelPercentageModalProps> = ({
  isOpen,
  classificationType,
  classificationValues,
  classificationLabels,
  classificationColourScheme,
}) => {
  if (!isOpen) return null;

  // Simple logic to decide the section title
  const modalTitle = classificationType ? "Carrying Capacity" : "Z-Score";

  return (
    <Box
      sx={{
        mt: 2,
        borderTop: "1px solid #D1D5DB", // approximate for Tailwind's border-gray-300
        pt: 2,
      }}
    >
      {/* Title with optional leaf icon */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: "bold",
          }}
        >
          <span role="img" aria-label="leaf">
            🍃
          </span>
          {modalTitle}
        </Typography>
      </Box>

      {/* Horizontal row of percentages */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {classificationValues.map((value, idx) => {
          const label = classificationLabels[idx] ?? `Label ${idx + 1}`;
          const color = classificationColourScheme[idx] ?? "#333";
          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mx: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", color }}>
                {value}%
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color }}>
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SidePanelPercentageModal;
