import React from "react";
import DropDown from "@/components/atoms/DropDown";
import SearchBar from "@/components/molecules/SearchBar";
import { useState } from "react";
import SidePanel from "@/components/organisms/SidePanel";
import BarChart from "@/components/charts/barchart";


/** An About page */
export type Province = {
  Aimag: string;
  Year: number;
  Camel: number;
  Cattle: number;
  Goat: number;
  Horse: number;
  Sheep: number;
};

export type Provinces = {
  Aimag: string;
  Year: number[];
  Camel: number[];
  Cattle: number[];
  Goat: number[];
  Horse: number[];
  Sheep: number[];
};

export type Mongolia = {
  [Aimag: string]: Province[];
};

const About = () => {
  return (
    <div>
    <Button onClick={handlePanelToggle} label="Toggle SidePanel" />
      <SidePanel isOpen={isPanelOpen} onClose={handlePanelToggle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 11, marginRight: "1rem" }}>
            <SearchBar onSearch={handleSearchResult} />
          </div>
        </div>
        {/* <ScatterLinePlot datasets={goats} livestock={"Goats"} /> */}
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
        >
          <div style={{ flex: 11, marginRight: "1rem" }}>
            <DropDown
              options={yearRange.map((year) => year.toString())}
              value={selectedOption}
              onChange={handleYearChange}
              label="Select a year"
            />
          </div>
        </div>
        {selectedAimag && filteredData.length > 0 && (
          <div>
            <BarChart datasets={filteredData} livestock={livestockTypes} />
          </div>
        )}
      </SidePanel>
    </div>
  );
};

export default About;
