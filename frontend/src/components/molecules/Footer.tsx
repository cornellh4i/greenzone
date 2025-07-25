import React from "react";
import { useRouter } from "next/router";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "#4E4E4E", color: "white", py: 6 }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          px: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Branding */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            GreenZone Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
            eiusmod tempor.
          </Typography>
        </Box>

        {/* Useful Links */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Useful Links
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {[
              { path: "/landing", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/summary-stats", label: "Insights" },
              { path: "/methodology", label: "Methodologies" },
              { path: "/monitoring-platform", label: "Launch platform" },
            ].map((item) => (
              <Box key={item.path} component="li" sx={{ mb: 1 }}>
                <Link
                  component="button"
                  onClick={() => handleNavigate(item.path)}
                  underline="hover"
                  sx={{ color: "white", "&:hover": { color: "grey-400" } }}
                >
                  {item.label}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Contact */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Box
            component="ul"
            sx={{ listStyle: "none", p: 0, m: 0, color: "white" }}
          >
            <Box component="li" sx={{ mb: 1 }}>
              email@organization.com
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              123-456-7890
            </Box>
            <Box component="li">Location, State, 12345</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
