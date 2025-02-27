import React, { useState } from "react";
import Fuse from "fuse.js";
import { Box } from "@mui/material";

import Dropdown from "../atoms/DropDown";
import Button from "../atoms/Button";

interface SearchBarParams {
  uniqueData: string[];
  onValueSelect: (searchValue: { value: string }) => void;
}

const SearchBar: React.FC<SearchBarParams> = ({
  uniqueData,
  onValueSelect,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const fuse = new Fuse(uniqueData, { threshold: 0.3 });

  const filteredOptions = selectedValue
    ? fuse.search(selectedValue).map((result) => result.item)
    : uniqueData;

  const handleOptionClick = () => {
    if (selectedValue) {
      // Ensure selectedValue is not null before calling onValueSelect
      onValueSelect({ value: selectedValue });
      setSelectedValue("");
    }
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
          options={filteredOptions}
          value={selectedValue}
          onChange={setSelectedValue}
          label="Select Aimag"
          sx={{ width: "100%" }}
        />
      </Box>
      <Button
        onClick={handleOptionClick}
        label="Search"
        sx={{
          height: "50px",
          width: "150px",
          marginLeft: "auto",
          flexShrink: 0,
        }}
        disabled={!selectedValue}
      />
    </Box>
  );
};

export default SearchBar;
