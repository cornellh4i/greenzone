import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  Collapse,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const NavBar: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleLanguage = () => {
    const newLang = selectedLanguage == "en" ? "mn" : "en";
    i18n.changeLanguage(i18n.language === "en" ? "mn" : "en");
    setSelectedLanguage(newLang);
  };
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const { t: tn } = useTranslation("navbar");
  const pages = [
    { name: "Home", path: "/", id: "home" },
    { name: "About", path: "/about", id: "about" },
    { name: "Insights", path: "/test", id: "insights" },
    { name: "Methodologies", path: "/test", id: "methods" },
    {
      name: "Paltform",
      path: "/monitoring-platform",
      id: "launch_platform",
    },
  ];

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ backgroundColor: "#E6EEEC" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1200px",
            px: 3,
            mx: "auto",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#065143",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              fontSize: isMobile ? "24px" : "30px",
            }}
          >
            {tn("appname")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile ? (
              <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <MenuIcon sx={{ color: "#065143" }} />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                {pages.map((page) => (
                  <Typography
                    onClick={() => handleNavigate(page.path)}
                    key={page.name}
                    sx={{
                      fontSize: "18px",
                      cursor: "pointer",
                      color: "#065143",
                      "&:hover": { textDecoration: "underline" },
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {tn(page.id)}
                  </Typography>
                ))}
                <Select
                  value={selectedLanguage}
                  variant="standard"
                  disableUnderline
                  sx={{
                    backgroundColor: "#E6EEEC",
                    borderRadius: "12px",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                    paddingY: "4px",
                    paddingX: "8px",
                    "& .MuiSelect-icon": {
                      right: 10,
                    },
                  }}
                  renderValue={() => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={`/flags_${
                          selectedLanguage === "en" ? "en" : "mn"
                        }.png`}
                        width={20}
                        alt="flag"
                      />
                      <span>{selectedLanguage === "en" ? "EN" : "MN"}</span>
                    </Box>
                  )}
                >
                  <MenuItem value="en" onClick={() => toggleLanguage()}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src="/flags_en.png" width={20} alt="EN" />
                      EN
                    </Box>
                  </MenuItem>
                  <MenuItem value="mn" onClick={() => toggleLanguage()}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src="/flags_mn.png" width={20} alt="MN" />
                      MN
                    </Box>
                  </MenuItem>
                </Select>
              </Box>
            )}
          </Box>
        </Box>
      </Toolbar>
      {isMobile && (
        <Collapse in={mobileMenuOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              px: 3,
              pt: 1,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#E6EEEC",
            }}
          >
            {pages.map((page) => (
              <Typography
                key={page.name}
                sx={{
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#000",
                }}
                onClick={() => handleNavigate(page.path)}
              >
                {tn(page.id)}
              </Typography>
            ))}

            <Box
              sx={{
                display: "flex",
                border: "2px solid #065143",
                borderRadius: "12px",
                overflow: "hidden",
                width: "fit-content",
              }}
            >
              <Button
                onClick={() => toggleLanguage()}
                disableRipple
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  minWidth: 120,
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: 0,
                  backgroundColor:
                    selectedLanguage === "en" ? "#065143" : "transparent",
                  color: selectedLanguage === "en" ? "white" : "#000",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor:
                      selectedLanguage === "en" ? "#043f33" : "transparent",
                  },
                }}
              >
                <img src="/flags_en.png" alt="EN" width={20} />
                English
              </Button>

              <Button
                onClick={() => toggleLanguage()}
                disableRipple
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  minWidth: 120,
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: 0,
                  backgroundColor:
                    selectedLanguage === "mn" ? "#065143" : "transparent",
                  color: selectedLanguage === "mn" ? "white" : "#000",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor:
                      selectedLanguage === "mn" ? "#043f33" : "transparent",
                  },
                }}
              >
                <img src="/flags_mn.png" alt="MN" width={20} />
                Mongolian
              </Button>
            </Box>
          </Box>
        </Collapse>
      )}
    </AppBar>
  );
};

export default NavBar;
