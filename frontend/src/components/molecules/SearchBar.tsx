import React, { useState } from "react";
import Fuse from "fuse.js";
import data from "@/components/charts/data/mongolia-province-data.json";

const SearchBar: React.FC<{
  onSearch: (selectedAimag: string | null) => void;
}> = ({ onSearch }) => {
  const uniqueAimag = Array.from(
    new Set(
      Object.values(data)
        .flat()
        .map((item) => item.Aimag)
    )
  );

  const fuse = new Fuse(uniqueAimag, { threshold: 0.3 });

  const [inputValue, setInputValue] = useState("");

  const filteredOptions = inputValue
    ? fuse.search(inputValue).map((result) => result.item)
    : uniqueAimag;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option); // Set the selected option
    onSearch(option); // Trigger the search callback
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="Search Aimag"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setInputValue("")} // Show all options on focus
        style={{
          width: "100%",
          padding: "8px",
          boxSizing: "border-box",
        }}
      />
      {filteredOptions.length > 0 && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: "white",
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {filteredOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
