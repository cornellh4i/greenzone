import React from "react";
import NavBar from "../components/molecules/NavBar";
import InsightsPanel from "../components/summary-stats/InsightsPanel";
import InsightsDesc from "../components/summary-stats/InsightsDesc";
import Footer from "../components/molecules/Footer";

const SummaryPage: React.FC = () => {
  return (
    <div>
      <NavBar />
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        <InsightsDesc />
        <InsightsPanel />
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default SummaryPage;
