// import React, { useEffect } from "react";
// import { TextField } from "@mui/material";
// // import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

// interface TextFieldProps {
//   label: string;
//   name: string;
//   required?: boolean;
//   type?: string;
//   disabled?: boolean;
//   requiredMessage?: string;
//   // register: (name: any, options?: RegisterOptions) => UseFormRegisterReturn;
// }

// const CustomTextField = ({
//   label,
//   name,
//   required,
//   type = "text",
//   requiredMessage = "",
//   disabled = false,
// }: // register,
// TextFieldProps) => {
//   return (
//     <div>
//       <div>
//         {label} <span className="text-red-500">{requiredMessage}</span>
//       </div>
//       <TextField
//         type={type}
//         disabled={disabled}
//         size="small"
//         margin="dense"
//         fullWidth={true}
//         {...register(name, {
//           required: required,
//         })}
//         sx={{ borderRadius: 2, borderColor: "primary.main" }}
//       />
//     </div>
//   );
// };

// export default CustomTextField;

import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const TextBox = ({ textLabel }: { textLabel: string }) => {
  const [value, setValue] = useState("");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <TextField
        label={textLabel}
        variant="outlined"
        value={value}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </div>
  );
};

export default TextBox;
