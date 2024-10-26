import React from 'react';
import NavBar from "../components/molecules/NavBar";

const Landing = () => {
  return (
    <div className="text-center p-4">
        <NavBar />
        <h1 className="text-2xl font-semibold">Hi! This is the Landing page</h1>
    </div>
  );
};

export default Landing;