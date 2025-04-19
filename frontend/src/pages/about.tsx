import React from "react";
import "../app/about.css";
import MapComponent from "@/components/organisms/Map";
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
/*const About = () => {
  console.log("about!");
  return (
    <div>

    </div>
  );
};

export default About;*/
// app/about/page.tsx (or your preferred path)

import Image from "next/image";

const teamMembers = [
  {
    name: "Oyut Armarjargal",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    image: "/Oyut.png", // Replace with actual path if needed
  },
  {
    name: "Khusel Avirmed",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    image: "/Khusel.png", // Replace with actual path if needed
  },
  {
    name: "Turbold Baatarchuluu",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    image: "/Turbold.png", // Replace with actual path if needed
  },
];

const About = () => {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-text">
          <h1 className="text-3xl font-bold about-heading">About GreenZone</h1>
          <div className="header-subtext">
            <h2 className="text-xl about-section-title">
              Our Purpose and Mission
            </h2>
            <p className="about-subtext">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
              eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit sed do eiusmod tempor.
            </p>
            <p className="about-subtext">
              Lorem ipsum dolor sit amet sed do eiusmod tempor.
            </p>
          </div>
        </div>
        <div className="image-wrapper">
  <Image
    src="/Landscape.png"
    alt="Landscape"
    width={605}
    height={346.13}
    className="landscape-image"
  />
</div>

      </section>

      <section className="who-we-are">
        <h2 className="about-section-title">Who We Are</h2>
        <p className="about-subtext">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod
          tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
          eiusmod tempor.
        </p>
        <p className="about-subtext">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod
          tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
          eiusmod tempor.
        </p>
        <p className="about-subtext">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod
          tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
          eiusmod tempor.
        </p>
      </section>

      <section className="contact-container">
          {teamMembers.map((member) => (
            <div className="member-card" key={member.name}>
              <Image
                src={member.image}
                alt={member.name}
                width={250}
                height={250}
                className="contact-photo"
              />
              <h3 className="mt-4 about-section-title contact-name">{member.name}</h3>
              <p className="text-sm text-gray-600 mt-1 contact-description">
                {member.description}
              </p>
            </div>
          ))}
      </section>
    </div>
  );
};

export default About;
//h3y
