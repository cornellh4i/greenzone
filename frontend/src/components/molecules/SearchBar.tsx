import React, { useState } from "react";
import { Box } from "@mui/material";

import Dropdown from "../atoms/DropDown";
import Button from "../atoms/Button";
import data from "@/components/charts/data/mongolia-province-data.json";

const SearchBar: React.FC<{
  onSearch: (selectedAimag: string | null, selectedYear: string | null) => void;
}> = ({ onSearch }) => {
  const uniqueAimag = Array.from(
    new Set(
      Object.values(data)
        .flat()
        .map((item) => item.Aimag)
    )
  );

  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const handleSearch = () => {
    onSearch(selectedAimag, selectedYear);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      {" "}
      <Box sx={{ flexGrow: 1, minWidth: 150, paddingRight: "16px" }}>
        <Dropdown
          options={uniqueAimag}
          value={selectedAimag}
          onChange={setSelectedAimag}
          label="Select Aimag"
          sx={{ width: "100%" }}
        />
      </Box>
      <Button
        onClick={handleSearch}
        label="Search"
        sx={{
          height: "50px",
          width: "150px",
          marginLeft: "auto",
          flexShrink: 0,
        }}
        disabled={!selectedAimag}
      />
    </Box>
  );
};

export default SearchBar;
