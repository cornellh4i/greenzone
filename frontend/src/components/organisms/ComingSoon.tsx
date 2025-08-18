import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ComingSoonPage() {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/horse.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 100%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            fontSize: {
              xs: "clamp(2rem, 8vw, 3.25rem)",
              sm: "clamp(2.5rem, 8vw, 4rem)",
              md: "clamp(3rem, 7vw, 5rem)",
            },
            color: "#065143",
          }}
        >
          Coming Soon
        </Typography>
        <Typography
          component="p"
          sx={{
            maxWidth: 900,
            mt: 3,
            textAlign: "center",
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
            fontWeight: 500,
            color: "#065143",
            mx: "auto",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Follow our journey as we restore Mongolia’s rangelands.
        </Typography>
      </Box>
    </Box>
  );
}
