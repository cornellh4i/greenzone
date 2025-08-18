import React from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const router = useRouter();
  const { t: tf } = useTranslation("footer");
  const handleNavigate = (path: string) => router.push(path);

  const pages = [
    { name: "Home", path: "/", id: "home" },
    { name: "About", path: "/about", id: "about" },
    { name: "Insights", path: "/test", id: "insights" },
    { name: "Methodologies", path: "/test", id: "methods" },
    { name: "Paltform", path: "/test", id: "launch_platform" },
  ];

  const textBase = {
    color: "#FFF",
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontFamily: "Poppins, sans-serif",
    lineHeight: "143%",
    letterSpacing: "0.17px",
  } as const;

  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "#4E4E4E", color: "white", py: 6 }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
          gap: { xs: 4, md: 6 },
          alignItems: "flex-start",
          textAlign: "left",
        }}
      >
        {/* Left column */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              ...textBase,
              fontWeight: 600,
              fontSize: { xs: "20px", md: "24px" },
              mb: 2,
            }}
          >
            {tf("appname")}
          </Typography>
          <Typography
            sx={{
              ...textBase,
              fontWeight: 400,
              fontSize: { xs: "13px", md: "15px" },
              mb: 2,
            }}
          >
            {tf("footer_text")}
          </Typography>
          <Typography
            sx={{
              ...textBase,
              fontWeight: 400,
              fontSize: { xs: "13px", md: "15px" },
            }}
          >
            {tf("footer_text_talk")}
          </Typography>
        </Box>

        {/* Middle column */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              ...textBase,
              fontWeight: 600,
              fontSize: { xs: "20px", md: "24px" },
              mb: 2,
            }}
          >
            {tf("useful_links")}
          </Typography>
          <Box
            component="ul"
            sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 1.25 }}
          >
            {pages.map((page) => (
              <Typography
                key={page.name}
                component="li"
                onClick={() => handleNavigate(page.path)}
                sx={{
                  ...textBase,
                  fontWeight: 400,
                  fontSize: { xs: "14px", md: "16px" },
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {tf(page.id)}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Right column */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              ...textBase,
              fontWeight: 600,
              fontSize: { xs: "20px", md: "24px" },
              mb: 2,
            }}
          >
            {tf("contact")}
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            <Box
              component="li"
              sx={{
                ...textBase,
                fontWeight: 400,
                fontSize: { xs: "14px", md: "16px" },
              }}
            >
              greenzone@organization.com
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
