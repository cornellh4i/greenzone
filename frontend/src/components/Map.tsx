// Map.tsx
import React, { useState, useEffect } from "react";
import { Map } from "react-map-gl/maplibre";
import { PolygonLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import * as d3 from "d3";
import * as d3Geo from "d3-geo";
import "maplibre-gl/dist/maplibre-gl.css";

const INITIAL_VIEW_STATE = {
  latitude: 37.8,
  longitude: -96,
  zoom: 4,
  bearing: 0,
  pitch: 0,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapComponent = () => {
  const [hexagons, setHexagons] = useState([]);

  useEffect(() => {
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/us_states_hexgrid.geojson.json"
    ).then((geojsonData) => {
      const projection = d3Geo.geoMercator();

      const deckHexProj = geojsonData.features.map((feature) => {
        const projectedPolygon =
          feature.geometry.coordinates[0].map(projection);
        const invertedPolygon = projectedPolygon.map(projection.invert);
        return { vertices: invertedPolygon };
      });
      setHexagons(deckHexProj);
    });
  }, []);

  const hexagonLayer = new PolygonLayer({
    id: "d3-hexagon-layer",
    data: hexagons,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 150, 136, 180],
    lineWidthMinPixels: 1,
    autoHighlight: true,
  });

  const handleMapLoad = (event) => {
    const map = event.target;
    const overlay = new MapboxOverlay({ layers: [hexagonLayer] });
    map.addControl(overlay);
  };

  return (
    <Map
      initialViewState={INITIAL_VIEW_STATE}
      mapStyle={MAP_STYLE}
      style={{ width: "100vw", height: "100vh" }}
      onLoad={handleMapLoad}
    />
  );
};

export default MapComponent;
