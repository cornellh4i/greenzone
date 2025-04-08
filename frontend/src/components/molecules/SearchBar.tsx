import React, { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import { Box, debounce } from "@mui/material";
import SearchBarDropdown from "../atoms/SearchBarDropDown";
import Button from "../atoms/Button";

interface SearchBarParams {
  countyMap: {
    [county_id: number]: {
      county_id: number;
      county_name: string;
      province_name: string;
      province_id: number;
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
        province_id: number;
      }
    | undefined
  >(undefined);

  const [searchCounty, setSearchCounty] = useState<boolean | undefined>(
    undefined
  );

  const countyOptions = useMemo(
    () =>
      Object.values(countyMap).map((county) => ({
        ...county,
      })),
    [countyMap]
  );
  // const [searchProvince, setSearchProvince] = useState<number | undefined>(
  //   undefined
  // );
  const [searchData, setSearchData] = useState(countyOptions);
  const fuse = useMemo(
    () =>
      new Fuse(countyOptions, {
        keys: ["county_name"],
        threshold: 0.8, // Reduce threshold for better matches
        minMatchCharLength: 2,
        includeScore: false, // Remove score to reduce computation overhead
        findAllMatches: true,
      }),
    [countyOptions]
  );

  const handleSearch = useCallback(
    debounce((inputValue: string) => {
      if (!inputValue) {
        setSearchData(countyOptions);
        return;
      }
      setSearchData(fuse.search(inputValue).map((result) => result.item));
    }, 200), // Adjust debounce delay to 200ms for smoother search
    [fuse, countyOptions]
  );

  // Handle user selection from dropdown
  const handleSelection = (selectedItem: {
    county_id: number;
    county_name: string;
    province_name: string;
    province_id: number;
  }) => {
    setSearchCounty(true);
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
