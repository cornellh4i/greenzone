import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

let MapContainer: React.ComponentType<any>;
let TileLayer: React.ComponentType<any>;
let GeoJSON: React.ComponentType<any>;

if (typeof window !== "undefined") {
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
          axios.get("http://localhost:8080/api/province"),
          axios.get("http://localhost:8080/api/county"),
          axios.get("http://localhost:8080/api/hexagons"),
        ]);

      // Extract data from responses
      const provinces = provincesResponse.data;
      const counties = countiesResponse.data;
      const hexagons = hexagonsResponse.data;

      return { provinces, counties, hexagons };
    } catch (error: AxiosError | any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error:", error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
      }
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
