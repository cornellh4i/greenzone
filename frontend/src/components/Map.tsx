/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck comment
import React, { useState, useEffect } from "react";
import { Map, MapRef, NavigationControl } from "react-map-gl/maplibre";
import { PolygonLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import * as d3Geo from "d3-geo";
import proj4 from "proj4";
import "maplibre-gl/dist/maplibre-gl.css";
import { FlyToInterpolator } from "@deck.gl/core";

const INITIAL_VIEW_STATE = {
  latitude: 46.8625,
  longitude: 103.8467,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
};

// For the Geometrical Shapes on the Maps like Province And Counties
interface Geometry {
  type: string;
  name: string;
  coordinates: number[];
}
// For the Geometrical Shapes on the Maps like Province And Counties
interface CellGeometry {
  type: string;
  name: string;
  coordinates: number[];
  vertices: [number, number][];
}

interface MapProps {
  showBelowCells: boolean | null;
  showAtCapCells: boolean | null;
  showAboveCells: boolean | null;
}

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

// Define the projection transformation from EPSG:32646 (UTM Zone 46N) to WGS84
proj4.defs("EPSG:32646", "+proj=utm +zone=46 +datum=WGS84 +units=m +no_defs");

const MapComponent: React.FC<MapProps> = ({
  onProvinceSelect,
  showAboveCells,
  showAtCapCells,
  showBelowCells,
}) => {
  const [provinces, setProvinces] = useState<Geometry[]>([]);
  const [soums, setSoums] = useState<Geometry[]>([]);
  const [showCells, setShowCells] = useState(false);
  const [map, setMap] = useState<MapRef | null>(null);
  const [cells, setCells] = useState<CellGeometry[]>([]);
  const [belowCells, setBelowCells] = useState<CellGeometry[]>([]);
  const [atCapCells, setAtCapCells] = useState<CellGeometry[]>([]);
  const [aboveCells, setAboveCells] = useState<CellGeometry[]>([]);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  // const [showBelowCells, setShowBelowCells] = useState(false);
  // const [showAtCapCells, setShowAtCapCells] = useState(false);
  // const [showAboveCells, setShowAboveCells] = useState(false);

  const loadCarryingCapacityCells = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/hexagons");
      const below_response = await fetch(
        "http://localhost:8080/api//hexagons/bm_pred_below"
      );
      const at_cap_response = await fetch(
        "http://localhost:8080/api//hexagons/bm_pred_at_cap"
      );
      const above_response = await fetch(
        "http://localhost:8080/api//hexagons/bm_pred_above"
      );
      const json_object = await response.json();
      const geojsonData = json_object;

      const json_object_below = await below_response.json();
      const geojsonDataBelow = json_object_below;

      const json_object_at_cap = await at_cap_response.json();
      const geojsonDataAtCap = json_object_at_cap;

      const json_object_above = await above_response.json();
      const geojsonDataAbove = json_object_above;

      // THIS BLOCK IS REQUIRED TO CONVERT HEX COORDINATES - no need to understand it
      const deckHexProj = geojsonData.map((feature: any) => {
        return {
          vertices: feature.geometry.coordinates[0], // Polygon vertices
          bm_pred: feature.bm_pred,
        };
      });
      const deckHexProjBelow = geojsonDataBelow.map((feature: any) => {
        return {
          vertices: feature.geometry.coordinates[0], // Polygon vertices
          bm_pred: feature.bm_pred,
        };
      });
      const deckHexProjAtCap = geojsonDataAtCap.map((feature: any) => {
        return {
          vertices: feature.geometry.coordinates[0], // Polygon vertices
          bm_pred: feature.bm_pred,
        };
      });
      const deckHexProjAbove = geojsonDataAbove.map((feature: any) => {
        return {
          vertices: feature.geometry.coordinates[0], // Polygon vertices
          bm_pred: feature.bm_pred,
        };
      });
      setCells(deckHexProj);
      setBelowCells(deckHexProjBelow);
      setAtCapCells(deckHexProjAtCap);
      setAboveCells(deckHexProjAbove);
    } catch (error) {
      console.error("Error fetching data from Express:", error);
    }
  };
  const loadProvinceGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/province");
      const json_object = await response.json();
      const geojsonData = json_object;
      const projection = d3Geo.geoMercator();
      const deckProvinceProj = geojsonData.map((feature: any) => {
        feature.geometry.coordinates[0].map(projection);
        const bounds = feature.geometry.coordinates[0].reduce(
          (bbox, [lng, lat]) => {
            return [
              Math.min(bbox[0], lng), // Min longitude
              Math.min(bbox[1], lat), // Min latitude
              Math.max(bbox[2], lng), // Max longitude
              Math.max(bbox[3], lat), // Max latitude
            ];
          },
          [Infinity, Infinity, -Infinity, -Infinity]
        );

        const provinceName = feature.province_name;
        return {
          type: "Polygon",
          name: provinceName,
          coordinates: feature.geometry.coordinates[0],
          view: bounds,
        };
      });
      setProvinces(deckProvinceProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };
  const loadCountiesGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/county");
      const json_object = await response.json();
      const geojsonData = json_object;
      const projection = d3Geo.geoMercator();
      const deckSoumProj = geojsonData.map((feature: any) => {
        feature.geometry.coordinates[0].map(projection);

        const soumName = feature.soum_name;
        return {
          type: "Polygon",
          name: soumName,
          coordinates: feature.geometry.coordinates[0],
        };
      });
      setSoums(deckSoumProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };
  const handleZoomToProvince = (bounds: [number, number, number, number]) => {
    map.fitBounds(bounds, {
      padding: 50, // Add padding to ensure the province is not cut off
      maxZoom: 8, // Set a maximum zoom level
      duration: 1500, // Smooth animation duration (in ms)
    });
  };

  const handleMapClick = (
    provinceName: string | null,
    coordinates: number[] | null,
    view: [number, number, number, number] | null
  ) => {
    if (!map) return;

    if (provinceName && coordinates) {
      handleZoomToProvince(view);
      // Trigger the onProvinceSelect callback
      onProvinceSelect({ name: provinceName });
    }
  };

  useEffect(() => {
    loadCountiesGeometries();
    loadProvinceGeometries();
    loadCarryingCapacityCells();
  }, []);

  const provinceLayer = new PolygonLayer({
    id: "province-layer",
    data: provinces,
    getPolygon: (d) => d.coordinates,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 1,
    pickable: true,
    autoHighlight: true,
    highlightColor: [1000, 20, 20, 20],
    onClick: ({ object }) => {
      if (object) {
        handleMapClick(object.name, object.coordinates[0], object.view);
      } else {
        handleMapClick(null, null, null); // Click outside the polygons
      }
    },
  });
  const soumLayer = new PolygonLayer({
    id: "soum-layer",
    data: soums,
    getPolygon: (d) => d.coordinates,
    // filled: true,
    getLineColor: [0, 0, 0, 70],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 0.5,
    // pickable: true,
    // autoHighlight: true,
  });

  const cellsBelowLayer = new PolygonLayer({
    id: "hexagonBelow-layer",
    data: belowCells,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 170, 60, 200],
    lineWidthMinPixels: 1,
  });

  const cellsAtCapLayer = new PolygonLayer({
    id: "hexagonAtCap-layer",
    data: atCapCells,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [255, 255, 20, 150],
    lineWidthMinPixels: 1,
  });

  const cellsAboveLayer = new PolygonLayer({
    id: "hexagon-above-layer",
    data: aboveCells,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [214, 15, 2, 150],
    lineWidthMinPixels: 1,
  });

  const handleMapLoad = (event: mapboxgl.MapboxEvent) => {
    setMap(event.target as unknown as MapRef);
  };

  useEffect(() => {
    if (!map) return; // Ensure map is loaded
    const layers = [];
    layers.push(provinceLayer);
    layers.push(soumLayer);
    // if (showCells) layers.push(cellLayer);
    // if (showCounties) layers.push(countyLayer);
    if (showBelowCells) layers.push(cellsBelowLayer);
    if (showAtCapCells) layers.push(cellsAtCapLayer);
    if (showAboveCells) layers.push(cellsAboveLayer);
    const overlay = new MapboxOverlay({ layers });
    map.addControl(overlay);
    return () => {
      map.removeControl(overlay);
    };
  }, [map, showBelowCells, showAtCapCells, showAboveCells, showCells]);

  if (!provinces || (provinces.length === 0 && !soums) || soums.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        {...viewState}
        mapStyle={MAP_STYLE}
        style={{ width: "100vw", height: "100vh" }}
        onLoad={handleMapLoad}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        <NavigationControl position="top-left" />
      </Map>
    </>
  );
};

export default MapComponent;
