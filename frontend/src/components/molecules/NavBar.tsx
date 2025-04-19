
import React, { useState } from "react";
import { useRouter } from "next/router";
import { AppBar, Toolbar, Box, Typography, Button, MenuItem, Select } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const NavBar: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'mn'>('en');
  const handleLanguageChange = (event: any) => {
    setSelectedLanguage(event.target.value);
  };
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const pages = [
    { name: "Map", path: "/monitoring-platform" },
    { name: "Landing", path: "/landing" },
    { name: "About", path: "/about" },
    { name: "Methodology", path: "/methodology" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login" },
    { name: "Summary Stats", path: "/summary-stats" },
  ];

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ backgroundColor: '#E6EEEC' }} 
      >
      <Toolbar sx={{ justifyContent: 'space-between'}}>
        <Typography variant="h6" component="div" sx={{
          color: '#065143', fontWeight: 'bold',
          fontSize: isMobile ? '24px' : '30px',
        }}>
          GreenZone Analytics
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            backgroundColor: '#E6EEEC',
            padding: 1.5,
            borderRadius: 2,
            marginTop: isMobile ? 2 : 0,
            alignItems: 'center',
          }}
        >
        <Button variant="text" color="inherit"sx={{ textTransform: 'none', fontSize: '18px',}} onClick = {() => handleNavigate('/about')}>
            About
        </Button>
        <Button variant="text" color="inherit"sx={{ textTransform: 'none', fontSize: '18px', }} onClick={() => handleNavigate('/summary-stats')}>
          Insights
        </Button>
        <Button variant="text" color="inherit"sx={{ textTransform: 'none', fontSize: '18px',}} onClick = {() => handleNavigate('/methodology')}>
          Methodologies
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#065143',
            borderRadius: '12px',
            '&:hover': { bgcolor: '#043F33' },
            color: 'white',
            fontSize: '18px',
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1, 
            paddingX: 2,
            paddingY: 1,
          }} onClick = {() => handleNavigate('/monitoring-platform')}
        >
          Launch
        <img
          src="/launch_icon.png"
          alt="icon"
          style={{ width: 20, height: 20 }}
        /> 
      </Button>
      <Box sx={{ minWidth: 160 }}>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              variant="standard"
              disableUnderline
              sx={{
                backgroundColor: '#E6EEEC',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                paddingY: '4px',
                paddingX: '8px',
                '& .MuiSelect-icon': {
                  right: 10,
                },
              }}
              renderValue={() => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={`/flags_${selectedLanguage === 'en' ? 'en' : 'mn'}.png`}
                    width={20}
                    alt="flag"
                  />
                  <span>{selectedLanguage === 'en' ? 'EN' : 'MN'}</span>
                </Box>
              )}
            >
              <MenuItem value="en">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src="/flags_en.png" width={20} alt="EN" />
                  EN
                </Box>
              </MenuItem>
              <MenuItem value="mn">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src="/flags_mn.png" width={20} alt="MN" />
                  MN
                </Box>
              </MenuItem>
            </Select>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;