import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
// import DropDown from "@/components/atoms/DropDown";
import SearchBar from "@/components/molecules/SearchBar";
import BarChart from "@/components/charts/barchart";
import { Box, Drawer } from "@mui/material";

import RadioButton from "@/components/atoms/RadioButton";
import Slide from "@/components/atoms/Slide";
import Toggle from "@/components/atoms/Toggle";
import { Geometry } from "../Map";
import { select } from "d3";

interface SidePanelProps {
  data: Geometry[];
  provinceName?: string | null;
  setShowHexagons: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidePanel: React.FC<SidePanelProps> = ({
  data,
  provinceName,
  setShowHexagons,
}) => {
  const livestockTypes = ["Cattle", "Horse", "Goat", "Camel", "Sheep"];
  // const yearRange = [2007, 2014]; // example year range
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2014);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);
  const [provinceData, setProvinceData] = useState<any | null>(null); // State to store province data

  const loadProvince = (province: string) => {
    const year = selectedYear || 2014;
    const provinceData = data.find((d) => d.provinceName === province);
    const province_name = provinceData.provinceName;
    const province_land_area = provinceData.provinceLandArea;
    const province_herders = provinceData.provinceHerders;

    const selectedYearData = {
      number_of_livestock: provinceData.livestock[year],
      number_of_cattle: provinceData.cattle[year],
      // json_object.province_number_of_cattle[selectedYear || 2014],
      number_of_goat: provinceData.goat[year],
      // json_object.province_number_of_goat[selectedYear || 2014],
      number_of_sheep: provinceData.sheep[year],
      // json_object.province_number_of_sheep[selectedYear || 2014],
      number_of_camel: provinceData.camel[year],
      // json_object.province_number_of_camel[selectedYear || 2014],
      number_of_horse: provinceData.horse[year],
      // json_object.province_number_of_horse[selectedYear || 2014],
    };

    const formattedData = livestockTypes.map((livestockType) => ({
      x: livestockType,
      y: selectedYearData[`number_of_${livestockType.toLowerCase()}`] || 0,
    }));

    setProvinceData({
      province_name,
      province_land_area,
      province_herders,
      selectedYearData,
      formattedData,
    });
  };

  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/province/${selectedAimag}`
  //     );
  //     const json_object = await response.json();

  //     // Extract general information (non-year dependent)
  //     const { province_name, province_land_area, province_herders } =
  //       json_object;

  //     // Extract year-dependent livestock data based on the selected year
  //     const selectedYearData = {
  //       number_of_livestock:
  //         json_object.province_number_of_livestock[selectedYear || 2014],
  //       number_of_cattle:
  //         json_object.province_number_of_cattle[selectedYear || 2014],
  //       number_of_goat:
  //         json_object.province_number_of_goat[selectedYear || 2014],
  //       number_of_sheep:
  //         json_object.province_number_of_sheep[selectedYear || 2014],
  //       number_of_camel:
  //         json_object.province_number_of_camel[selectedYear || 2014],
  //       number_of_horse:
  //         json_object.province_number_of_horse[selectedYear || 2014],
  //     };

  //     // Format data for the bar chart
  //     const formattedData = livestockTypes.map((livestockType) => ({
  //       x: livestockType,
  //       y: selectedYearData[`number_of_${livestockType.toLowerCase()}`] || 0,
  //     }));

  //     // Combine general information with year-specific data
  //     setProvinceData({
  //       province_name,
  //       province_land_area,
  //       province_herders,
  //       selectedYearData,
  //       formattedData,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data from Express:", error);
  //   }
  // };

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen);
    setSelectedAimag(null);
    setProvinceData(null); // Clear province data when closing panel
    setSelectedYear(2014);
  };

  const handleProvinceSearch = (aimag: string | null) => {
    setSelectedAimag(aimag);
  };

  const handleYearSlider = (year: number) => {
    setSelectedYear(year);
  };

  const handleBack = () => {
    setSelectedAimag(null);
    setProvinceData(null);
  };

  useEffect(() => {
    if (provinceName) {
      setSelectedAimag(provinceName);
      setIsPanelOpen(true);
    }
  }, [provinceName]);

  useEffect(() => {
    if (selectedAimag) {
      loadProvince(selectedAimag);
    }
  }, [selectedAimag]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    if (value === "carryingCapacity") {
      setShowHexagons(true);
    } else {
      setShowHexagons(false);
    }
  };

  const options = [
    {
      name: "carryingCapacity",
      label: "Carrying Capacity",
      content: (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => {}} label="Below" />
          <Button onClick={() => {}} label="At Capacity" />
          <Button onClick={() => {}} label="Above" />
        </div>
      ),
    },
    {
      name: "zScore",
      label: "Z-Score",
      content: (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => {}} label="Positive" />
          <Button onClick={() => {}} label="Zero" />
          <Button onClick={() => {}} label="Negative" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handlePanelToggle} label="Toggle SidePanel" />
      {isPanelOpen && (
        <div>
          <Drawer
            anchor="left"
            open={isPanelOpen}
            onClose={handlePanelToggle}
            PaperProps={{
              sx: {
                width: "80%",
                maxWidth: "550px",
                boxSizing: "border-box",
                p: 2,
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Box sx={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Button onClick={handlePanelToggle} label="Close" />
              </div>

              <div style={{ marginTop: "60px" }}>
                <SearchBar onSearch={handleProvinceSearch} />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "480px",
                    height: "860.01px",
                    padding: "16px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {!selectedAimag ? (
                    <>
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <h1
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "32px",
                            fontWeight: "600",
                            lineHeight: "45.76px",
                            letterSpacing: "0.17px",
                            textAlign: "left",
                          }}
                        >
                          Carrying Capacity Early Warning System
                        </h1>
                        <p
                          style={{
                            fontFamily: "Inter",
                            fontSize: "20px",
                            fontWeight: "400",
                            lineHeight: "28.6px",
                            letterSpacing: "0.17px",
                            textAlign: "left",
                          }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Nullam vehicula nisi a facilisis tempor.
                        </p>
                      </div>
                      <hr
                        style={{ border: "1px solid gray", margin: "10px 0" }}
                      />

                      <Slide
                        name="Year"
                        selectedValue={selectedYear}
                        onChange={handleYearSlider}
                        min={2002}
                        max={2014}
                      />
                      <hr
                        style={{ border: "1px solid gray", margin: "10px 0" }}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h2
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "20px",
                            fontWeight: "600",
                            lineHeight: "28.6px",
                            letterSpacing: "0.17px",
                            textAlign: "left",
                            textDecoration: "none",
                            marginRight: "10px",
                          }}
                        >
                          Grazing Range
                        </h2>
                        <Toggle initialChecked={false} onChange={() => {}} />
                      </div>
                      <p
                        style={{
                          fontFamily: "Inter",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "28.6px",
                          letterSpacing: "0.17px",
                          textAlign: "left",
                          marginTop: "10px",
                        }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam vehicula nisi a facilisis tempor.
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h2
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "20px",
                            fontWeight: "600",
                            lineHeight: "28.6px",
                            letterSpacing: "0.17px",
                            textAlign: "left",
                            textDecoration: "none",
                            marginRight: "10px",
                          }}
                        >
                          Data Layers
                        </h2>
                        <span
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "gray",
                            display: "inline-block",
                          }}
                        ></span>
                      </div>
                      <RadioButton
                        options={options}
                        selectedOption={selectedOption}
                        onChange={handleOptionChange}
                      />
                    </>
                  ) : (
                    <div>
                      {provinceData ? (
                        <>
                          <Button onClick={handleBack} label="Back" />
                          <h1>{provinceData.province_name}</h1>
                          <p>
                            <strong>Land Area:</strong>{" "}
                            {provinceData.province_land_area}
                          </p>
                          <p>
                            <strong>Number of Herders:</strong>{" "}
                            {provinceData.province_herders}
                          </p>

                          <h2>Livestock Data for {selectedYear}</h2>

                          {provinceData &&
                            provinceData.formattedData.length > 0 && (
                              <BarChart
                                datasets={[
                                  {
                                    aimag: selectedAimag,
                                    data: provinceData.formattedData,
                                  },
                                ]}
                                livestock={livestockTypes}
                              />
                            )}
                        </>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Box>
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
