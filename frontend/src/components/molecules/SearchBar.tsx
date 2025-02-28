import React, { useState } from "react";
import Fuse from "fuse.js";
import { Box } from "@mui/material";

import Dropdown from "../atoms/DropDown";
import Button from "../atoms/Button";

/*interface SearchBarParams {
  uniqueData: string[];
  onValueSelect: (searchValue: { value: string }) => void;
}*/

interface SearchBarParams {
  countyMap: { [key: string]: number };
  onValueSelect: (countyData: { value: string }) => void;
}

const SearchBar: React.FC<SearchBarParams> = ({
  countyMap,
  onValueSelect,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const countyNames = Object.keys(countyMap);
  const fuse = new Fuse(countyNames, { threshold: 0.3 });

  const filteredOptions = selectedValue
    ? fuse.search(selectedValue).map((result) => result.item)
    : countyNames;

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
          label="Select County"
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
