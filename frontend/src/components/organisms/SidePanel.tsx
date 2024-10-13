import React from "react";
import { Box, Drawer, Button } from "@mui/material";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, children }) => (
  <Drawer anchor="left" open={isOpen} onClose={onClose}PaperProps={{
      sx: {width: '80%', maxWidth: '550px', boxSizing: "border-box",
        p: 2, display: "flex", flexDirection: "column"},}}>
    <Box sx={{ position: "relative", width: "100%" }}>
      <Button
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        Close
      </Button>
      <Box sx={{ mt: 6 }}>{children}</Box>
    </Box>
  </Drawer>
);

export default SidePanel;
