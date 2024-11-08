import React, { useEffect, useState } from "react";
import axios from "axios";

let MapContainer: React.ComponentType<any>;
let TileLayer: React.ComponentType<any>;
let GeoJSON: React.ComponentType<any>;

if (typeof window !== "undefined") {
  // Dynamically import the components only on the client side
  const leaflet = require("react-leaflet");
  MapContainer = leaflet.MapContainer as React.ComponentType<any>;
  TileLayer = leaflet.TileLayer as React.ComponentType<any>;
  GeoJSON = leaflet.GeoJSON as React.ComponentType<any>;

  require("leaflet/dist/leaflet.css");
}

interface MapData {
  provinces: any[];
  counties: any[];
  hexagons: any[];
}

function MapComponent() {
  const [mapData, setMapData] = useState<MapData>({
    provinces: [],
    counties: [],
    hexagons: [],
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    fetchMapData().then((data) => {
      if (data) setMapData(data);
    });
  }, []);

  async function fetchMapData() {
    try {
      const [provincesResponse, countiesResponse, hexagonsResponse] =
        await Promise.all([
          axios.get("/province"),
          axios.get("/county"),
          axios.get("/hexagons"),
        ]);

      // Extract data from responses
      const provinces = provincesResponse.data;
      const counties = countiesResponse.data;
      const hexagons = hexagonsResponse.data;

      return { provinces, counties, hexagons };
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  }

  if (!isClient || typeof window === "undefined") {
    return null;
  }

  return (
    <MapContainer
      center={[46.8625, 103.8467]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
      />
      {mapData.provinces.map((province, index) => (
        <GeoJSON
          key={index}
          data={province}
          style={{ color: "green", weight: 1.5 }}
        />
      ))}
      {mapData.counties.map((county, index) => (
        <GeoJSON
          key={index}
          data={county}
          style={{ color: "purple", weight: 1 }}
        />
      ))}
      {mapData.hexagons.map((hexagon, index) => (
        <GeoJSON
          key={index}
          data={hexagon}
          style={{ color: "orange", weight: 0.5 }}
        />
      ))}
    </MapContainer>
  );
}

export default MapComponent;
