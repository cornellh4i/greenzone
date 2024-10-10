// // // // import data from "@/components/charts/data/mongolia-province-data.json";
// // // // import { useState } from "react";

// // // // interface ProvinceData {
// // // //   Aimag: string;
// // // //   Year: number;
// // // //   Camel: number;
// // // //   Cattle: number;
// // // //   Goat: number;
// // // //   Horse: number;
// // // //   Sheep: number;
// // // // }

// // // // interface MongoliaProvinceData {
// // // //   [key: string]: ProvinceData[];
// // // // }

// // // // export default function DropDown() {
// // // //   const provinceData = data as MongoliaProvinceData; // Cast the imported data
// // // //   const [selectedProvince, setSelectedProvince] = useState<string>("");

// // // //   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// // // //     setSelectedProvince(event.target.value);
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <label htmlFor="province-select">Select a Province:</label>
// // // //       <select
// // // //         id="province-select"
// // // //         value={selectedProvince}
// // // //         onChange={handleChange}
// // // //       >
// // // //         <option value="">Select</option>
// // // //         {Object.keys(provinceData).map((aimag) => (
// // // //           <option key={aimag} value={aimag}>
// // // //             {aimag}
// // // //           </option>
// // // //         ))}
// // // //       </select>

// // // //       {selectedProvince && (
// // // //         <div>
// // // //           <h3>Data for {selectedProvince}:</h3>
// // // //           <ul>
// // // //             {provinceData[selectedProvince].map((item) => (
// // // //               <li key={item.Year}>
// // // //                 {item.Aimag}: {item.Year} - Camels: {item.Camel}, Cattle:{" "}
// // // //                 {item.Cattle}, Goats: {item.Goat}, Horses: {item.Horse}, Sheep:{" "}
// // // //                 {item.Sheep}
// // // //               </li>
// // // //             ))}
// // // //           </ul>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // import React from "react";

// // // interface ProvinceData {
// // //   Aimag: string;
// // //   Year: number;
// // //   Camel: number;
// // //   Cattle: number;
// // //   Goat: number;
// // //   Horse: number;
// // //   Sheep: number;
// // // }

// // // interface MongoliaProvinceData {
// // //   [key: string]: ProvinceData[];
// // // }

// // // interface DropDownProps {
// // //   selectedProvince: string;
// // //   onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
// // // }

// // // const data =
// // //   require("@/components/charts/data/mongolia-province-data.json") as MongoliaProvinceData;

// // // export default function DropDown({
// // //   selectedProvince,
// // //   onChange,
// // // }: DropDownProps) {
// // //   return (
// // //     <div>
// // //       <label htmlFor="province-select">Select a Province:</label>
// // //       <select id="province-select" value={selectedProvince} onChange={onChange}>
// // //         <option value="">--Please choose an option--</option>
// // //         {Object.keys(data).map((aimag) => (
// // //           <option key={aimag} value={aimag}>
// // //             {aimag}
// // //           </option>
// // //         ))}
// // //       </select>
// // //     </div>
// // //   );
// // // }

// // import React from "react";
// // import { Autocomplete, TextField } from "@mui/material";

// // interface DropdownProps {
// //   options: string[];
// //   value: string | null;
// //   onChange: (value: string | null) => void;
// //   label: string;
// // }

// // const Dropdown: React.FC<DropdownProps> = ({
// //   options,
// //   value,
// //   onChange,
// //   label,
// // }) => {
// //   return (
// //     <Autocomplete
// //       options={options}
// //       getOptionLabel={(option) => option}
// //       value={value}
// //       onChange={(event, newValue) => {
// //         if (typeof newValue === "string" || newValue === null) {
// //           onChange(newValue);
// //         }
// //       }}
// //       renderInput={(params) => (
// //         <TextField {...params} label={label} variant="outlined" />
// //       )}
// //       freeSolo // Allows input of values not in the options
// //     />
// //   );
// // };

// // export default Dropdown;

// import React from 'react';
// import { Autocomplete, TextField } from '@mui/material';

// interface DropdownProps {
//   options: string[];
//   value: string | null;
//   onChange: (value: string | null) => void;
//   label: string;
// }

// const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, label }) => {
//   return (
//     <Autocomplete
//       options={options}
//       getOptionLabel={(option) => option}
//       value={value}
//       onChange={(event, newValue) => {
//         if (typeof newValue === 'string' || newValue === null) {
//           onChange(newValue);
//         }
//       }}
//       renderInput={(params) => (
//         <TextField {...params} label={label} variant="outlined" style={{ flexGrow: 1 }} /> // Use style instead of sx
//       )}
//       freeSolo // Allows input of values not in the options
//     />
//   );
// };

// export default Dropdown;

import React from "react";
import { Autocomplete, TextField } from "@mui/material";

interface DropdownProps {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  sx?: React.CSSProperties; // Add sx prop to allow styling
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  sx,
}) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option}
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string" || newValue === null) {
          onChange(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" sx={sx} /> // Pass sx to TextField
      )}
      freeSolo // Allows input of values not in the options
    />
  );
};

export default Dropdown;
