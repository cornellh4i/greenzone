// // src/components/SearchBox.tsx

// import React, { useState } from "react";
// import { Autocomplete, TextField } from "@mui/material";
// import data from "@/components/charts/data/mongolia-province-data.json";

// // Define the Fruit interface inside the SearchBox component file
// // interface Fruit {
// //   id: number;
// //   label: string;
// // }

// // Dummy data for demonstration
// // const data: Fruit[] = [
// //   { id: 1, label: "Apple" },
// //   { id: 2, label: "Banana" },
// //   { id: 3, label: "Cherry" },
// //   { id: 4, label: "Date" },
// //   { id: 5, label: "Elderberry" },
// // ];

// const SearchBox = () => {
//   const [value, setValue] = useState<Fruit | null>(null); // Specify type for the value

//   return (
//     <Autocomplete
//       options={data}
//       getOptionLabel={(option) => {
//         return (option as Fruit).label;
//       }}
//       value={value}
//       onChange={(event, newValue) => {
//         // Check if newValue is a Fruit or null before setting it
//         if (newValue && typeof newValue === "object") {
//           setValue(newValue as Fruit); // Cast to Fruit
//         } else {
//           setValue(null); // Set to null if it's a string or empty
//         }
//       }}
//       renderInput={(params) => (
//         <TextField {...params} label="Search Fruits" variant="outlined" />
//       )}
//       renderOption={(props, option) => (
//         <li {...props}>{(option as Fruit).label}</li>
//       )}
//       freeSolo // Allows input of values not in the options
//     />
//   );
// };

// export default SearchBox;

import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import data from "@/components/charts/data/mongolia-province-data.json"; // Import your JSON data

const SearchBox = () => {
  // Extract unique Aimags from the imported data
  const uniqueAimag = Array.from(
    new Set(
      Object.values(data) // Get the arrays of data values
        .flat() // Flatten the arrays into a single array
        .map((item) => item.Aimag) // Map to the Aimag property
    )
  );

  const [value, setValue] = useState<string | null>(null); // Specify type for the value

  return (
    <Autocomplete
      options={uniqueAimag}
      getOptionLabel={(option) => option} // Display the Aimag directly
      value={value}
      onChange={(event, newValue) => {
        // Check if newValue is a string or null before setting
        if (typeof newValue === "string" || newValue === null) {
          setValue(newValue); // Set the selected value
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search Aimags" variant="outlined" />
      )}
      renderOption={(props, option) => (
        <li {...props}>{option}</li> // Display the Aimag directly
      )}
      freeSolo // Allows input of values not in the options
    />
  );
};

export default SearchBox;
