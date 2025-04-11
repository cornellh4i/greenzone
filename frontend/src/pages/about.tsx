import React from "react";
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
    image: "/oyut.png", // Replace with actual path if needed
  },
  {
    name: "Khusel Avirmed",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    image: "/khusel.png", // Replace with actual path if needed
  },
  {
    name: "Turbold Baatarchuluu",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    image: "/turbold.png", // Replace with actual path if needed
  },
];

const About = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row items-start justify-between">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">About GreenZone</h1>
          <h2 className="text-xl font-semibold">Our Purpose and Mission</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
            eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit sed do eiusmod tempor.
          </p>
          <p>Lorem ipsum dolor sit amet sed do eiusmod tempor.</p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
          <Image
            src="/landscape.jpg" // Replace with actual path to the image
            alt="Landscape"
            width={500}
            height={300}
            className="rounded-xl object-cover"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Who We Are</h2>
        <div className="space-y-4 text-justify">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
            eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit sed do eiusmod tempor.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
            eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit sed do eiusmod tempor.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
            eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit sed do eiusmod tempor.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {teamMembers.map((member) => (
            <div key={member.name}>
              <Image
                src={member.image}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mx-auto"
              />
              <h3 className="mt-4 font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
