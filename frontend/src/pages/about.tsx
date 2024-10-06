// import React from "react";

// /** An About page */
// const About = () => {
//   return <>Hello there</>;
// };

// export default About;

// // Uncomment for Button Onboarding
import React from "react";
import Button from "@/components/Button";
import SimpleMap from "@/components/MapWrapper";

/** An About page */
const About = () => {
  return (
    <>
      {/* <Button /> */}
      <Button text="hello" />
      Hello there
      <SimpleMap />
    </>
  );
};

export default About;
