// import React from "react";

/** An About page */
// const About = () => {
//   return <>Hello there</>;
// };

// export default About;

// // Uncomment for Button Onboarding
import React from "react";
import Button from "@/components/Button";
import LineGraph from "@/components/charts/line-graph";
const data = [
  { x: 1.0, y: 9.0 },
  { x: 1.5, y: 6.0 },
  { x: 2.5, y: 4.0 },
  { x: 4.0, y: 2.0 },
  { x: 5.0, y: 1.6 },
  { x: 6.0, y: 2.4 },
  { x: 7.0, y: 3.0 },
  { x: 8.0, y: 3.4 },
  { x: 9.0, y: 3.6 },
];

/** An About page */
const About = () => {
  return (
    <>
      <Button text="Hello" />
      <br />
      {/* <Button text="hello" /> */}
      Hello there
      <br />
      <br />
      <br />
      <pre>
        <b>Line Graph:</b>
      </pre>
      <LineGraph info={data} />
    </>
  );
};

export default About;
