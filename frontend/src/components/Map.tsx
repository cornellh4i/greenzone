import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HexbinGrid from "@/components/HexGrid";
import { GeoJSON, FeatureCollection, GeoJsonObject } from "geojson";

const SimpleMap = () => {
  console.log("hello");
  const mapRef = useRef(null);
  // location of Mongolia
  const latitude = 46.8625;
  const longitude = 103.8467;

  // // try to the get the geojson data
  const [geojsonData, setGeojsonData] = useState(null);
  useEffect(() => {
    fetch("frontend/src/components/charts/data/green_zone_hex_map.geojson")
      .then((response) => response.json())
      .then((data) => setGeojsonData(data))
      .catch((error) => console.error("Error fetching GeoJSON:", error));
  }, []);

  // this is a test
  let dataTest: GeoJSON.GeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          grid_id: 19,
          grid_area: 58030217.764913522,
          aid: 82,
          sid: 7,
          asid: 8207,
          soum_utm_crs: 32646,
          attribute_1: 0.5986584841970366,
          area_km2: 5842.9575386325523,
          livestock: 8270,
          herders: 24,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [595731.121438624104485, 5187583.217247241176665],
              [600457.202397706802003, 5187583.217247241176665],
              [602820.24287724820897, 5191676.123418148607016],
              [600457.202397706802003, 5195769.029589056037366],
              [595731.121438624104485, 5195769.029589056037366],
              [593368.080959082697518, 5191676.123418148607016],
              [595731.121438624104485, 5187583.217247241176665],
            ],
          ],
        },
      },
    ],
  };

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={5.5}
      ref={mapRef}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?name=en"
      />
      <HexbinGrid
        geoData={dataTest}
        width={3000}
        height={3000}
        radius={10000}
      />
      {/* <HexbinLayer data={geojsonData} /> */}
      {/* <GeoJSON
        data={greenZoneData}
        style={() => ({
          color: "#3388ff", // Border color of polygons
          weight: 1, // Border thickness
          fillColor: "#cb1dd1", // Fill color of polygons
          fillOpacity: 0.5, // Transparency of polygons
        })}
      /> */}
    </MapContainer>
  );
};

export default SimpleMap;
