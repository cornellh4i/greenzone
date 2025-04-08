import React, { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import { Box, debounce } from "@mui/material";
import SearchBarDropdown from "../atoms/SearchBarDropDown";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        width: "100%",
        padding: "5px",
      }}
    >
      <SearchBarDropdown
        options={searchData}
        value={selectedValue}
        onChange={handleSelection}
        onInputChange={handleSearch}
      />
      <IconButton
        onClick={handleOptionClick}
        disabled={!selectedValue}
        sx={
          {
            // position: "absolute",
            // right: "20px",
            // top: "50%",
            // transform: "translateY(-50%)",
            // color: "grey",
          }
        }
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
};

export default SearchBar;
