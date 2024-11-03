import React, { useState, useEffect } from "react";
import { Map, MapRef } from "react-map-gl/maplibre";
import { PolygonLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import * as d3Geo from "d3-geo";
import "maplibre-gl/dist/maplibre-gl.css";
import Button from "./atoms/Button";

const INITIAL_VIEW_STATE = {
  latitude: 46.8625,
  longitude: 103.8467,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
};

interface Hexagon {
  vertices: [number, number][];
}

interface Geometry {
  type: string;
  coordinates: number[][][] | number[][];
}

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapComponent = () => {
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);
  const [country, setCountry] = useState<Geometry[]>([]);
  const [provinces, setProvinces] = useState<Geometry[]>([]);
  const [counties, setCounties] = useState<Geometry[]>([]);

  const [showHexagons, setShowHexagons] = useState(false);
  const [showProvinces, setShowProvinces] = useState(false);
  const [showCounties, setShowCounties] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [map, setMap] = useState<MapRef | null>(null);

  const loadGeoData = async () => {
    const geoData = await import("@/components/charts/data/convertedData.json"); // this is the converted geojson data from EPSG:32646 to WGS84 coordinates
    return geoData;
  };

  const loadCountryData = async () => {
    const stateData = await import("@/components/charts/data/country.json");
    return stateData;
  };

  const loadProvinceData = async () => {
    const provinceData = await import("@/components/charts/data/mn.json");
    return provinceData;
  };

  const loadCountyData = async () => {
    const countyData = await import("@/components/charts/data/counties.json");
    return countyData;
  };

  useEffect(() => {
    loadGeoData().then((geojsonData) => {
      const projection = d3Geo.geoMercator();

      const deckHexProj = geojsonData.features.map((feature: any) => {
        const projectedPolygon =
          feature.geometry.coordinates[0].map(projection);
        const invertedPolygon = projectedPolygon.map(projection.invert);
        return { vertices: invertedPolygon };
      });
      setHexagons(deckHexProj);
    });

    loadCountryData().then((geojsonData) => {
      const projection = d3Geo.geoMercator();

      const deckHexProj = geojsonData.geometries.map((feature: any) => {
        const projectedPolygon = feature.coordinates[0].map(projection);
        const invertedPolygon = projectedPolygon.map(projection.invert);
        return {
          type: "Polygon", // Use the appropriate type (e.g., "Polygon", "MultiPolygon", etc.)
          coordinates: [invertedPolygon], // Wrap in an array if it's a Polygon
        };
      });
      setCountry(deckHexProj);
    });

    loadProvinceData().then((geojsonData) => {
      const projection = d3Geo.geoMercator();

      const deckHexProj = geojsonData.features.map((feature: any) => {
        const projectedPolygon =
          feature.geometry.coordinates[0].map(projection);
        const invertedPolygon = projectedPolygon.map(projection.invert);
        return {
          type: "Polygon", // Use the appropriate type (e.g., "Polygon", "MultiPolygon", etc.)
          coordinates: [invertedPolygon], // Wrap in an array if it's a Polygon
        };
      });
      setProvinces(deckHexProj);
    });

    loadCountyData().then((geojsonData) => {
      const projection = d3Geo.geoMercator();

      const deckHexProj = geojsonData.geometries.map((feature: any) => {
        const projectedPolygon = feature.coordinates[0].map(projection);
        const invertedPolygon = projectedPolygon.map(projection.invert);
        return {
          type: "Polygon", // Use the appropriate type (e.g., "Polygon", "MultiPolygon", etc.)
          coordinates: [invertedPolygon], // Wrap in an array if it's a Polygon
        };
      });
      setCounties(deckHexProj);
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

  const countryLayer = new PolygonLayer({
    id: "country-layer",
    data: country,
    getPolygon: (d) => d.coordinates[0],
    stroked: true,
    filled: false,
    getLineColor: [255, 0, 0],
    lineWidthMinPixels: 1,
    pickable: true,
    onHover: handleHover,
    onClick: handleClick,
    getLineWidth: 2,
    updateTriggers: {
      getLineColor: hoverInfo ? [hoverInfo.feature] : [0, 0, 255],
    },
    parameters: {
      blend: true,
    },
  });

  const provienceLayer = new PolygonLayer({
    id: "province-layer",
    data: provinces,
    getPolygon: (d) => d.coordinates[0],
    stroked: true,
    filled: false,
    getLineColor: [0, 0, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    onHover: handleHover,
    onClick: handleClick,
    getLineWidth: 2,
    updateTriggers: {
      getLineColor: hoverInfo ? [hoverInfo.feature] : [0, 0, 255],
    },
    parameters: {
      blend: true,
    },
  });

  const countyLayer = new PolygonLayer({
    id: "county-layer",
    data: counties,
    getPolygon: (d) => d.coordinates[0],
    stroked: true,
    filled: false,
    getLineColor: [0, 0, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    onHover: handleHover,
    onClick: handleClick,
    getLineWidth: 2,
    updateTriggers: {
      getLineColor: hoverInfo ? [hoverInfo.feature] : [0, 0, 255],
    },
    parameters: {
      blend: true,
    },
  });

  const handleMapLoad = (event: mapboxgl.MapboxEvent) => {
    setMap(event.target as MapRef); // Store the map instance with correct type
  };

  useEffect(() => {
    if (!map) return; // Ensure map is loaded

    const layers = [];
    layers.push(countryLayer);
    if (showHexagons) layers.push(hexagonLayer);
    if (showProvinces) layers.push(provienceLayer);
    if (showCounties) layers.push(countyLayer);

    const overlay = new MapboxOverlay({ layers });

    // Clear any existing overlays and add the new one
    map.addControl(overlay);

    // Cleanup previous overlay
    return () => {
      map.removeControl(overlay);
    };
  }, [showHexagons, showProvinces, showCounties, map]);

  return (
    // <Map
    //   initialViewState={INITIAL_VIEW_STATE}
    //   mapStyle={MAP_STYLE}
    //   style={{ width: "100vw", height: "100vh" }}
    //   onLoad={handleMapLoad}
    // />
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <Button
          label="Toggle Hexagons"
          onClick={() => setShowHexagons((prev) => !prev)}
        />
        <Button
          label="Toggle Provinces"
          onClick={() => setShowProvinces((prev) => !prev)}
        />
        <Button
          label="Toggle Counties"
          onClick={() => setShowCounties((prev) => !prev)}
        />
      </div>
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        style={{ width: "100vw", height: "100vh" }}
        onLoad={handleMapLoad}
      />
      {/* {hoverInfo && (
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
      )} */}
    </>
  );
};

export default MapComponent;
