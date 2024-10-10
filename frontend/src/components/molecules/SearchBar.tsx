// // import React, { useState } from "react";
// // import { Autocomplete, TextField } from "@mui/material";
// // import data from "@/components/charts/data/mongolia-province-data.json"; // Import your JSON data

// // const SearchBox = () => {
// //   // Extract unique Aimags from the imported data
// //   const uniqueAimag = Array.from(
// //     new Set(
// //       Object.values(data) // Get the arrays of data values
// //         .flat() // Flatten the arrays into a single array
// //         .map((item) => item.Aimag) // Map to the Aimag property
// //     )
// //   );

// //   const [value, setValue] = useState<string | null>(null); // Specify type for the value

// //   return (
// //     <Autocomplete
// //       options={uniqueAimag}
// //       getOptionLabel={(option) => option} // Display the Aimag directly
// //       value={value}
// //       onChange={(event, newValue) => {
// //         // Check if newValue is a string or null before setting
// //         if (typeof newValue === "string" || newValue === null) {
// //           setValue(newValue); // Set the selected value
// //         }
// //       }}
// //       renderInput={(params) => (
// //         <TextField {...params} label="Search Aimags" variant="outlined" />
// //       )}
// //       renderOption={(props, option) => (
// //         <li {...props}>{option}</li> // Display the Aimag directly
// //       )}
// //       freeSolo // Allows input of values not in the options
// //     />
// //   );
// // };

// // export default SearchBox;

// import React, { useState } from "react";
// import { Box } from "@mui/material";
// import TextBox from "../atoms/TextBox";
// import Dropdown from "../atoms/DropDown";
// import Button from "../atoms/Button";
// import data from "@/components/charts/data/mongolia-province-data.json"; // Import your JSON data

// const SearchBar: React.FC = () => {
//   // Extract unique Aimags from the imported data
//   const uniqueAimag = Array.from(
//     new Set(
//       Object.values(data)
//         .flat()
//         .map((item) => item.Aimag) // Map to the Aimag property
//     )
//   );

//   const [selectedAimag, setSelectedAimag] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string | null>(null);

//   const handleSearch = () => {
//     console.log("Searching for:", { selectedAimag, searchTerm });
//   };

//   return (
//     <Box display="flex" alignItems="center" gap={2} width="100%">
//       <Dropdown
//         options={uniqueAimag}
//         value={selectedAimag}
//         onChange={setSelectedAimag}
//         label="Select Aimag"
//         sx={{ flexGrow: 1, minWidth: 200 }}
//       />
//       {/* <TextBox value={searchTerm} onChange={setSearchTerm} label="Search" /> */}
//       <Button onClick={handleSearch} label="Search" />
//     </Box>
//   );
// };

// export default SearchBar;

import React, { useState } from "react";
import { Box } from "@mui/material";
import TextBox from "../atoms/TextBox";
import Dropdown from "../atoms/DropDown";
import Button from "../atoms/Button";
import data from "@/components/charts/data/mongolia-province-data.json"; // Import your JSON data

const SearchBar: React.FC = () => {
  // Extract unique Aimags from the imported data
  const uniqueAimag = Array.from(
    new Set(
      Object.values(data)
        .flat()
        .map((item) => item.Aimag) // Map to the Aimag property
    )
  );

  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const handleSearch = () => {
    console.log("Searching for:", { selectedAimag, searchTerm });
    // Add your search logic here
  };

  return (
    <Box display="flex" alignItems="center" gap={2} width="100%">
      {" "}
      {/* Ensure the Box takes full width */}
      <Dropdown
        options={uniqueAimag}
        value={selectedAimag}
        onChange={setSelectedAimag}
        label="Select Aimag"
        sx={{ flexGrow: 1, minWidth: 200 }} // Now valid if you use Solution 1
      />
      {/* <TextBox value={searchTerm} onChange={setSearchTerm} label="Search" /> */}
      <Button onClick={handleSearch} label="Search" />
    </Box>
  );
};

export default SearchBar;
