// // import React from "react";
// // import { Button } from "@mui/material";

// // interface ButtonProps {
// //   children: string;
// //   color: "gray" | "dark-gray";
// //   onClick?: () => void;
// //   type?: "button" | "submit" | "reset" | undefined;
// // }

// // /** A Button page */
// // const Buttons = ({ children, color, onClick, type }: ButtonProps) => {
// //   return (
// //     <Button
// //       fullWidth={true}
// //       type={type}
// //       variant="contained"
// //       onClick={onClick}
// //       disableElevation
// //       sx={{ textTransform: "capitalize" }}
// //       className={
// //         color == "gray"
// //           ? "bg-gray-300 text-black"
// //           : color == "dark-gray"
// //           ? "bg-gray-400 text-black"
// //           : ""
// //       }
// //     >
// //       {children}
// //     </Button>
// //   );
// // };

// // export default Buttons;

// interface ButtonProps {
//   searchTerm: string;
// }

// const onClick = (searchTerm: string) => {
//   console.log(searchTerm);
// };

// export default function Button({ searchTerm }: ButtonProps) {
//   return (
//     <div>
//       <button onClick={() => onClick(searchTerm)}>Search</button>
//     </div>
//   );
// }

import React from "react";
import { Button as MuiButton } from "@mui/material";

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <MuiButton variant="contained" onClick={onClick}>
      {label}
    </MuiButton>
  );
};

export default Button;
