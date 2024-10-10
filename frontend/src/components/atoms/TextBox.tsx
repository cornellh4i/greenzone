// // import { SetStateAction, useState } from "react";

// // interface TextBoxProps {
// //   onChange: (value: string) => void;
// // }

// // export default function TextBox({ onChange }: TextBoxProps) {
// //   const [value, setValue] = useState("");

// //   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const newValue = event.target.value;
// //     setValue(newValue);
// //     onChange(newValue); // Update the parent with the new value
// //   };

// //   return (
// //     <div>
// //       <input type="text" value={value} onChange={handleChange} />
// //     </div>
// //   );
// // }

// import React from "react";

// interface TextBoxProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// export default function TextBox({ value, onChange }: TextBoxProps) {
//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     onChange(event.target.value);
//   };

//   return (
//     <div>
//       <input type="text" value={value} onChange={handleChange} />
//     </div>
//   );
// }

import React from "react";
import { TextField } from "@mui/material";

interface TextBoxProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
}

const TextBox: React.FC<TextBoxProps> = ({ value, onChange, label }) => {
  return (
    <TextField
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      variant="outlined"
      fullWidth
    />
  );
};

export default TextBox;
