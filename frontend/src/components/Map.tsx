import React, { useState, useEffect } from "react";
import { Map } from "react-map-gl/maplibre";
import { PolygonLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import * as d3 from "d3";
import * as d3Geo from "d3-geo";
import "maplibre-gl/dist/maplibre-gl.css";
import Button from "./Button"; // Adjust path based on your structure

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
  const [provinces, setProvinces] = useState([]);
  const [counties, setCounties] = useState([]);
  const [showHexagons, setShowHexagons] = useState(false);
  const [showProvinces, setShowProvinces] = useState(false);
  const [showCounties, setShowCounties] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const loadState = async () => {
    const stateData = await import(
      "@/components/charts/data/mng_admbnda_adm0_nso_20201019.json"
    );
    return stateData;
  };

  const loadProvinceData = async () => {
    const provinceData = await import(
      "@/components/charts/data/mng_admbnda_adm1_nso_20201019.json"
    );
    return provinceData;
  };

  const loadCountyData = async () => {
    const countyData = await import(
      "@/components/charts/data/mng_admbnda_adm2_nso_20201019.json"
    );
    return countyData;
  };

  useEffect(() => {
    d3.json(
      "/workspaces/greenzone/frontend/src/components/charts/data/mng_admbnda_adm0_nso_20201019.shp"
    ).then((geojsonData) => {
      const projection = d3Geo.geoMercator();
      const deckHexProj = (
        geojsonData as GeoJSON.FeatureCollection
      ).features.map((feature) => {
        const projectedPolygon =
          feature.geometry.coordinates[0].map(projection);
        const invertedPolygon = projectedPolygon.map(projection.invert);
        return { vertices: invertedPolygon };
      });
      setHexagons(deckHexProj);
    });

    d3.json("https://path/to/province/geojson").then((geojsonData) => {
      setProvinces(geojsonData.features);
    });

    d3.json("https://path/to/county/geojson").then((geojsonData) => {
      setCounties(geojsonData.features);
    });
  }, []);

  const handleHover = ({ object, x, y }) => {
    if (object) {
      setHoverInfo({ x, y, feature: object });
    } else {
      setHoverInfo(null);
    }
  };

  const handleClick = ({ object }) => {
    if (object && object.geometry) {
      const [longitude, latitude] = d3Geo.geoCentroid(object);
      setViewState({
        ...viewState,
        latitude,
        longitude,
        zoom: 8, // Adjust zoom level as needed
        transitionInterpolator: new maplibregl.FlyToInterpolator(),
      });
    }
  };

  const hexagonLayer = new PolygonLayer({
    id: "hexagon-layer",
    data: hexagons,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: false,
    getLineColor: [0, 0, 0],
    lineWidthMinPixels: 1,
    updateTriggers: {
      getPolygon: [viewState.zoom], // Ensure smooth adaptation
    },
  });

  const provinceLayer = new PolygonLayer({
    id: "province-layer",
    data: provinces,
    getPolygon: (d) => d.geometry.coordinates[0],
    stroked: true,
    filled: false,
    getLineColor: [255, 0, 0],
    lineWidthMinPixels: 1,
    pickable: true,
    onHover: handleHover,
    onClick: handleClick,
    getLineWidth: 2,
    parameters: {
      depthTest: false, // Ensures lines appear above other layers
    },
  });

  const countyLayer = new PolygonLayer({
    id: "county-layer",
    data: counties,
    getPolygon: (d) => d.geometry.coordinates[0],
    stroked: true,
    filled: false,
    getLineColor: [0, 0, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    onHover: handleHover,
    onClick: handleClick,
    getLineWidth: 2,
    getLineColor: [0, 0, 255],
    updateTriggers: {
      getLineColor: hoverInfo ? [hoverInfo.feature] : [0, 0, 255],
    },
    parameters: {
      blend: true,
    },
  });

  const handleMapLoad = (event) => {
    const map = event.target;
    const layers = [];
    if (showHexagons) layers.push(hexagonLayer);
    if (showProvinces) layers.push(provinceLayer);
    if (showCounties) layers.push(countyLayer);
    const overlay = new MapboxOverlay({ layers });
    map.addControl(overlay);
  };

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <Button
          text="Toggle Hexagons"
          onClick={() => setShowHexagons(!showHexagons)}
        />
        <Button
          text="Toggle Provinces"
          onClick={() => setShowProvinces(!showProvinces)}
        />
        <Button
          text="Toggle Counties"
          onClick={() => setShowCounties(!showCounties)}
        />
      </div>
      <Map
        {...viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        mapStyle={MAP_STYLE}
        style={{ width: "100vw", height: "100vh" }}
        onLoad={handleMapLoad}
      />
      {hoverInfo && (
        <div
          style={{
            position: "absolute",
            left: hoverInfo.x,
            top: hoverInfo.y,
            backgroundColor: "white",
            padding: "5px",
            pointerEvents: "none",
            border: "1px solid black",
          }}
        >
          Hovering over: {hoverInfo.feature.properties.name || "Unknown"}
        </div>
      )}
    </>
  );
};

export default MapComponent;
