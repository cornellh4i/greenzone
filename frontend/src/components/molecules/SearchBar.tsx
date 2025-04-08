import React, { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import { Box, debounce } from "@mui/material";
import SearchBarDropdown from "../atoms/SearchBarDropDown";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface CountyOption {
  entity_id: number;
  entity_name: string;
  entity_type: string;
  entity_sub_id: number | null;
  entity_sub_name: string | null;
}
interface SearchBarParams {
  entityMap: {
    [entity_id: number]: CountyOption;
  };
  onValueSelect: (entityData: CountyOption) => void;
}

const SearchBar: React.FC<SearchBarParams> = ({ entityMap, onValueSelect }) => {
  const [selectedValue, setSelectedValue] = useState<CountyOption | undefined>(
    undefined
  );

  const [searchCounty, setSearchCounty] = useState<boolean | undefined>(
    undefined
  );

  const entityOptions = useMemo(
    () =>
      Object.values(entityMap).map((entity) => ({
        ...entity,
      })),
    [entityMap]
  );
  // const [searchProvince, setSearchProvince] = useState<number | undefined>(
  //   undefined
  // );
  const [searchData, setSearchData] = useState(entityOptions);
  const fuse = useMemo(
    () =>
      new Fuse(entityOptions, {
        keys: ["entity_name"],
        threshold: 0.8, // Reduce threshold for better matches
        minMatchCharLength: 2,
        includeScore: false, // Remove score to reduce computation overhead
        findAllMatches: true,
      }),
    [entityOptions]
  );

  const handleSearch = useCallback(
    debounce((inputValue: string) => {
      if (!inputValue) {
        setSearchData(entityOptions);
        return;
      }
      setSearchData(fuse.search(inputValue).map((result) => result.item));
    }, 200), // Adjust debounce delay to 200ms for smoother search
    [fuse, entityOptions]
  );

  // Handle user selection from dropdown
  const handleSelection = (selectedItem: CountyOption) => {
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
