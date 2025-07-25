import React from "react";
import { Box, Typography } from "@mui/material";

import { LayerType } from "../../utils/global";

interface SidePanelPercentageModalProps {
  isOpen: boolean;

  classificationType: LayerType | null;

  classificationValues: number[];

  classificationLabels: string[];

  classificationColourScheme: string[];
}

const LeafIcon = () => (
  <svg
    style={{ paddingTop: "10px" }}
    width="31"
    height="30"
    viewBox="0 0 31 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.2483 6.96753C12.3014 6.96753 8.9621 9.55359 7.82724 13.1188C9.51446 12.2652 11.4176 11.7881 13.4362 11.7881H17.8551C18.297 11.7881 18.6586 12.1497 18.6586 12.5916C18.6586 13.0335 18.297 13.395 17.8551 13.395H17.0517H13.4362C12.6027 13.395 11.7942 13.4904 11.0109 13.6662C9.7103 13.9624 8.50514 14.4897 7.42553 15.2078C4.51307 17.1511 2.58984 20.4703 2.58984 24.2414V25.0448C2.58984 25.7127 3.12714 26.25 3.795 26.25C4.46285 26.25 5.00015 25.7127 5.00015 25.0448V24.2414C5.00015 21.7959 6.0396 19.5965 7.70171 18.0549C8.69596 21.8462 12.1457 24.6431 16.2483 24.6431H16.2985C22.9318 24.608 28.2998 18.07 28.2998 10.0105C28.2998 7.87139 27.9232 5.83769 27.2403 4.00485C27.1097 3.65837 26.6026 3.67344 26.4268 3.99983C25.4828 5.76739 23.6148 6.96753 21.4706 6.96753H16.2483Z"
      fill="black"
    />
  </svg>
);

const SidePanelPercentageModal: React.FC<SidePanelPercentageModalProps> = ({
  isOpen,
  classificationType,
  classificationValues,
  classificationLabels,
  classificationColourScheme,
}) => {
  if (!isOpen) return null;

  // Simple logic to decide the section title
  const modalTitle =
    classificationType === LayerType.CarryingCapacity
      ? "Carrying Capacity"
      : "Z-Score";

  return (
    <Box
      sx={{
        mt: 2,
        borderTop: "1px solid #D1D5DB",
        pt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          fontFamily="Poppins, sans-serif"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          <span role="img" aria-label="leaf">
            <LeafIcon />
          </span>
          {modalTitle}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
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
                maxWidth: 120,
              }}
            >
              <Typography
                variant="h5"
                fontFamily="Poppins, sans-serif"
                sx={{
                  fontWeight: "bold",
                  color,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {value}%
              </Typography>
              <Typography
                variant="body2"
                fontFamily="Poppins, sans-serif"
                sx={{
                  fontWeight: 900,
                  color,
                  textAlign: "center",
                }}
              >
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
