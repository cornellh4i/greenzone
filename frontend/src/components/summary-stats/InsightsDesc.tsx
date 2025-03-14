import React from "react";

const InsightsPanel = () => {
  return (
    <div className="bg-gray-100 py-12 px-4 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center bg-white shadow-lg rounded-2xl p-12">
        {/* Text Content */}
        <div className="md:w-1/2 pr-12">
          <p className="text-gray-400 text-lg font-medium">content</p>
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">Insights</h2>
          <h3 className="text-2xl font-bold mt-4 text-gray-900">How to interpret our data</h3>
          <p className="text-gray-700 mt-6 leading-relaxed text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
          </p>
          <p className="text-gray-700 mt-6 leading-relaxed text-lg">
            Lorem ipsum dolor sit amet sed do eiusmod tempor.
          </p>
        </div>
        {/* Image */}
        <div className="md:w-1/2 flex justify-end">
          <img
            src="mountain.png"
            alt="Mountain Scene"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;