import React from "react";
import InsightsPanel from "../components/summary-stats/InsightsPanel";
import InsightsDesc from "../components/summary-stats/InsightsDesc";

const SummaryPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto mt-12">
        <InsightsDesc />
      </div>
      <InsightsPanel />
    </div>
  );
};

export default SummaryPage;
