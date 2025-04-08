import React, { useState, useMemo, useCallback, useEffect } from "react";
import Fuse from "fuse.js";
import { Box } from "@mui/material";
import SearchBarDropdown from "../atoms/SearchBarDropDown";
import Button from "../atoms/Button";

interface Entity {
  entity_id: number;
  entity_name: string;
  entity_type: string; // "province" or "county"
  entity_sub_id: number | null;
  entity_sub_name: string | null;
}

interface SearchBarParams {
  entityList: Entity[];
  onValueSelect: (selectedEntity: Entity) => void;
}


const SearchBar: React.FC<SearchBarParams> = ({ entityList, onValueSelect }) => {
  const [selectedValue, setSelectedValue] = useState<Entity | undefined>(undefined);


  const [searchData, setSearchData] = useState(entityList);

  const fuse = new Fuse(entityList, {
    keys: ["entity_name"],
    threshold: 0.8,
    minMatchCharLength: 2,
    includeScore: false,
    findAllMatches: true,
  });


  useEffect(() => {
    setSearchData(entityList);
  }, [entityList]);

  const handleSearch = (inputValue: string) => {
    if (!inputValue) {
      setSearchData(entityList);
      return;
    }

    setSearchData(fuse.search(inputValue).map((result) => result.item));

  };


  //Handle user selection from dropdown
  const handleSelection = (selectedItem: Entity) => {
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
      {" "}
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
