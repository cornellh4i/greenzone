import React, { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Polygon } from "react-leaflet";
import { greenZoneData } from "/Users/srijaghosh/Desktop/Hack4Impact/GreenZone_Dev/greenzone/frontend/src/components/charts/data/green_zone_hex_map.geojson";
import { geoData } from "frontend/src/components/charts/data/greenzone_hex_map.csv";
const SimpleMap = () => {

  const mapRef = useRef(null);
  const latitude = 46.8625; // Hard-Coded for demo purposes
  const longitude = 103.8467;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={5.5}
      ref={mapRef}
      style={{ height: "100vh", width: "100vw" }}
    >

      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
      />
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

