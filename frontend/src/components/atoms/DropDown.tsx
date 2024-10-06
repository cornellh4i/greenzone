// import * as React from "react";
// import Box from "@mui/material/Box";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import { lab } from "d3";
// import data from "@/components/charts/data/mongolia-province-data.json";

// export default function BasicSelect({ label }: { label: string }) {
//   const [age, setAge] = React.useState("");

//   const handleChange = (event: SelectChangeEvent) => {
//     setAge(event.target.value as string);
//   };

//   return (
//     <Box sx={{ minWidth: 120 }}>
//       <FormControl fullWidth>
//         <InputLabel id="demo-simple-select-label">{label}</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           value={age}
//           label={label}
//           onChange={handleChange}
//         >
//           {/* <MenuItem value={10}>Ten</MenuItem>
//           <MenuItem value={20}>Twenty</MenuItem>
//           <MenuItem value={30}>Thirty</MenuItem> */}
//         </Select>
//       </FormControl>
//     </Box>
//   );
// }

import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const DropDown = ({ label, data }: { label: string; data: any }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedValue(event.target.value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select value={selectedValue} onChange={handleChange} variant="outlined">
        {/* Loop through the regions (keys of the data object) */}
        {Object.keys(data).map((region) =>
          // Map through each region's array of data and extract the year
          data[region].map(
            (
              item: { Year: string | number | readonly string[] | undefined },
              index: React.Key | null | undefined
            ) => (
              <MenuItem key={index} value={item.Year}>
                {`${item.Year}`}
              </MenuItem>
            )
          )
        )}
      </Select>
    </FormControl>
  );
};

export default DropDown;
