// import React from "react";

/** A simple Button component */
// const Button = () => {
//   return <button>Press me</button>;
// };

// export default Button;

// // Uncomment for Button Prop Onboarding
import React from "react";

/**
 * Component for a general button
 * @param text is the text on the button
 */

interface Props {
  text: string;
  onClick: () => void;
}

const Button: React.FC<Props> = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

export default Button;
