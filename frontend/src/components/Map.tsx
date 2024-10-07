import React, { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SimpleMap = () => {

  const mapRef = useRef(null);
  const latitude = 51.505; // Hard-Coded for demo purposes
  const longitude = -0.09;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      ref={mapRef}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};



export default SimpleMap;

