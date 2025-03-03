// asid --> aimag
// province_id --> province
// precompute if somethign is a province or a county
// county, keep track of what it is (soum or aimag) --> if it is a county
// in the dictionary, we also add the id, when we pas the value for the id. instead of passing in a province name, we are putting in an id. 

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
  countyMap: { [key: string]: { county_id: number; province_name: string } };
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
    if (selectedValue && countyMap[selectedValue]) {
      // Ensure selectedValue is not null before calling onValueSelect
      const countyId = countyMap[selectedValue].county_id;
      //onValueSelect({ value: selectedValue });
      onValueSelect({ value: countyId.toString() });
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
          countyMap={countyMap}
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
