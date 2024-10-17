import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import d3 from "d3";
import { Polygon } from "react-leaflet";

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
