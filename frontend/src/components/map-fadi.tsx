import React, { useState, useEffect } from "react";
import { Map, NavigationControl } from "react-map-gl/maplibre";
import { PolygonLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import "maplibre-gl/dist/maplibre-gl.css";
import geojsonData from "../components/charts/data/converted_to_wgs84_geojson.json";

const INITIAL_VIEW_STATE = {
  latitude: 46.8625,
  longitude: 103.8467,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapComponent: React.FC = () => {
  const [hexagons, setHexagons] = useState([]);

  // use this useEffect to import the data and then
  useEffect(() => {
    // Fetch the GeoJSON data

    const hexagonsForDeckGL = geojsonData.features.map(
      (feature: any, index: any) => {
        return {
          id: index, // Add a unique ID
          vertices: feature.geometry.coordinates[0], // Polygon vertices
          count: 1, // Placeholder count
        };
      }
    );

    setHexagons(hexagonsForDeckGL);
  }, []);

  // Will render filled or stroked polygons on the map.
  // docs : https://deck.gl/docs/api-reference/layers/polygon-layer
  const hexagonLayer = new PolygonLayer({
    id: "d3-hexagon-layer",
    data: hexagons,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 2,
    pickable: true,
    autoHighlight: true,
    highlightColor: [20, 20, 20, 20],
    onHover: (d) => {
      console.log(d);
    },
  });

  // This bridges Deck.gl and MapLibre. It integrates Deck.gl layers into the MapLibre map
  // docs : https://deck.gl/docs/api-reference/mapbox/mapbox-overlay
  const handleMapLoad = (event: { target: any }) => {
    const map = event.target;
    const overlay = new MapboxOverlay({ layers: [hexagonLayer] });
    map.addControl(overlay);
  };

  // Map will be loaded when handleMapLoad is called
  return (
    <Map
      id="map"
      initialViewState={INITIAL_VIEW_STATE}
      mapStyle={MAP_STYLE}
      style={{ width: "100vw", height: "100vh" }}
      onLoad={handleMapLoad}
    >
      <NavigationControl position="top-left" />
    </Map>
  );
};
export default MapComponent;
