import React, { useState } from "react";
import { Box } from "@mui/material";
import TextBox from "../atoms/TextBox";
import Dropdown from "../atoms/DropDown";
import Button from "../atoms/Button";
import data from "@/components/charts/data/mongolia-province-data.json";

const SearchBar: React.FC = () => {
  const uniqueAimag = Array.from(
    new Set(
      Object.values(data)
        .flat()
        .map((item) => item.Aimag)
    )
  );

  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const handleSearch = () => {
    console.log("Searching for:", { selectedAimag, searchTerm });
  };

  return (
    <Box display="flex" alignItems="center" gap={2} width="100%">
      {" "}
      <Dropdown
        options={uniqueAimag}
        value={selectedAimag}
        onChange={setSelectedAimag}
        label="Select Aimag"
        sx={{ flexGrow: 1, minWidth: 200 }}
      />
      {/* <TextBox value={searchTerm} onChange={setSearchTerm} label="Search" /> */}
      <Button onClick={handleSearch} label="Search" />
    </Box>
  );
};

export default SearchBar;
