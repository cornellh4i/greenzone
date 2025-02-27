
import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Dropdown from "../atoms/DropDown";
import { useRouter } from "next/router";
import { AppBar, Toolbar, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const NavBar: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [currentPage, setCurrentPage] = useState("");

  const pages = [
    { name: "Map", path: "/monitoring-platform" },
    { name: "Landing", path: "/landing" },
    { name: "About", path: "/about" },
    { name: "Methodology", path: "/methodology" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login" },
    { name: "Summary Stats", path: "/summary-stats" },
  ];

  useEffect(() => {
    const current = pages.find((page) => page.path === router.pathname);
    setCurrentPage(current ? current.name : "");
  }, [router.pathname]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleDropdownChange = (value: string | null) => {
    const selectedPage = pages.find((page) => page.name === value);
    if (selectedPage) {
      navigateTo(selectedPage.path);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <Box sx={{ marginLeft: "auto" }}>
          {isMobile ? (
            <Dropdown
              options={pages.map((page) => page.name)}
              value={currentPage}
              onChange={handleDropdownChange}
              label={currentPage}
              sx={{
                width: "150px",
                color: "black",
                backgroundColor: "lightgray",
              }}
            />
          ) : (
            pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigateTo(page.path)}
                label={page.name}
                sx={{
                  color: "black",
                  backgroundColor: "lightgray",
                  margin: "0 10px",
                  "&:hover": {
                    backgroundColor: "#d3d3d3", // Slightly darker gray on hover
                  },
                }}
              />
            ))
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;