import React, { useState } from "react";
import Fuse from "fuse.js";
import { Box } from "@mui/material";
import SearchBarDropdown from "../atoms/SearchBarDropDown";
import Button from "../atoms/Button";

interface SearchBarParams {
  countyMap: {
    [county_id: number]: {
      county_id: number;
      county_name: string;
      province_name: string;
    };
  };
  onValueSelect: (countyData: {
    county_id: number;
    county_name: string;
    province_name: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarParams> = ({ countyMap, onValueSelect }) => {

  const [selectedValue, setSelectedValue] = useState<
    | {
      county_id: number;
      county_name: string;
      province_name: string;
    }
    | undefined
  >(undefined);
  console.log(countyMap);

  const [searchData, setSearchData] = useState(countyOptions);
  const fuse = new Fuse(countyOptions, {
    keys: ["county_name"],
    threshold: 0.5,
    includeScore: true,
    minMatchCharLength: 2,
    findAllMatches: true,
  });

  const handleSearch = (inputValue: string) => {
    if (!inputValue) {
      setSearchData(countyOptions);
      return;
    }
    const filteredOptions = fuse
      .search(inputValue)
      .map((result) => result.item);
    setSearchData(filteredOptions);
  };

  // Handle user selection from dropdown
  const handleSelection = (selectedItem: {
    county_id: number;
    county_name: string;
    province_name: string;
  }) => {
    setSelectedValue(selectedItem);
  };

  // Handle button click event
  const handleOptionClick = () => {
    if (selectedValue) {
      onValueSelect(selectedValue);
      setSelectedValue(undefined);
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
      {/* {" "} */}
      <Box sx={{ flexGrow: 1, minWidth: 150, paddingRight: "16px" }}>
        <SearchBarDropdown
          options={searchData}
          value={selectedValue}
          onChange={handleSelection} // fixes the value that the user clicks on
          onInputChange={handleSearch} // searches while user types
          // label="Select County"
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
