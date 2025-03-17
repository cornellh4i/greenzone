import React from "react";
import MapComponent from "@/components/Map";
import TopPanel from "@/components/organisms/TopPanel";
// import SimpleMap from "@/components/MapWrapper";
/** An About page */
/*const About = () => {
  return <>Hello there</>;
};

export default About;*/

// // Uncomment for Button Onboarding
// import React from "react";
// import Button from "@/components/Button";

/** An About page */
const About = () => {
  console.log("about!");
  return (
    <div>
      <TopPanel yearOptions={[]}></TopPanel>
      {/* <>
        <MapComponent />
      </> */}
    </div>
  );
};

export default About;
