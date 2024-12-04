import React, { useState } from "react";
import Fuse from "fuse.js";

interface SearchBarParams {
  uniqueData: string[];
  onValueSelect: (searchValue: { value: string }) => void;
}

const SearchBar: React.FC<SearchBarParams> = ({
  uniqueData,
  onValueSelect,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(""); // Start with an empty string
  const fuse = new Fuse(uniqueData, { threshold: 0.3 });

  const filteredOptions = selectedValue
    ? fuse.search(selectedValue).map((result) => result.item)
    : uniqueData;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleOptionClick = (option: string) => {
    setSelectedValue(option); // Set the selected option
    onValueSelect({ value: option }); // Correct key: 'value'
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="Search Aimag"
        value={selectedValue}
        onChange={handleInputChange}
        onFocus={() => setSelectedValue("")} // Show all options on focus
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
