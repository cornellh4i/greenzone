import React from 'react';
import NavBar from "../components/molecules/NavBar";
import LineGraph from "@/components/charts/scatter-line-plot";

const SummaryStats = () => {
  return (
    <div className="text-center p-4">
        <NavBar />
        <h1 className="text-2xl font-semibold">Hi! This is the Summary page</h1>
    </div>
  );
};

export default SummaryStats;