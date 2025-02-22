/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck comment
import { Map, MapRef, NavigationControl } from "react-map-gl/maplibre";
import React, { useContext, useState, useEffect } from "react";
import { PolygonLayer, ScatterplotLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Context } from "../utils/global";

const INITIAL_VIEW_STATE = {
  latitude: 46.8625,
  longitude: 103.8467,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
};

// For the Geometrical Shapes on the Maps like Province And Counties
interface Geometry {
  view: [number, number, number, number] | null;
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

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapComponent: React.FC = () => {
  const [provinces, setProvinces] = useState<Geometry[]>([]);
  const [soums, setSoums] = useState<Geometry[]>([]);
  // const [showCells, setShowCells] = useState(false);
  const [map, setMap] = useState<MapRef | null>(null);
  // const [cells, setCells] = useState<CellGeometry[]>([]);
  const [belowCells, setBelowCells] = useState<CellGeometry[]>([]);
  const [atCapCells, setAtCapCells] = useState<CellGeometry[]>([]);
  const [aboveCells, setAboveCells] = useState<CellGeometry[]>([]);
  const [zScoreNegativeCells, setZScoreNegativeCells] = useState<CellGeometry[]>([]);
  const [zScoreZeroCells, setZScoreZeroCells] = useState<CellGeometry[]>([]);
  const [zScorePositiveCells, setZScorePositiveCells] = useState<CellGeometry[]>([]);
  const [grazingTrueCells, setGrazingTrueCells] = useState<CellGeometry[]>([]);
  const [grazingFalseCells, setGrazingFalseCells] = useState<CellGeometry[]>(
    []
  );
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    showBelowCells,
    setSelectedProvince,
    showAboveCells,
    showAtCapCells,
    showZScoreBelowCells,
    showZScoreAtCapCells,
    showZScoreAboveCells,

    // searched,
  } = context;

  // This is for the circular elements
  const loadCarryingCapacityCells = async () => {
    try {
      const below_response = await fetch(
        "http://localhost:8080/api//cells/bm_pred_below"
      );
      const at_cap_response = await fetch(
        "http://localhost:8080/api//cells/bm_pred_at_cap"
      );
      const above_response = await fetch(
        "http://localhost:8080/api//cells/bm_pred_above"
      );

      const json_object_below = await below_response.json();
      const geojsonDataBelow = json_object_below;
      console.log(geojsonDataBelow);

      const json_object_at_cap = await at_cap_response.json();
      const geojsonDataAtCap = json_object_at_cap;

      const json_object_above = await above_response.json();
      const geojsonDataAbove = json_object_above;

      const deckCellProjBelow = geojsonDataBelow.data.map((feature: any) => {
        return {
          vertices: feature.wkb_geometry.coordinates, // Polygon vertices
          bm_pred: feature.bm_pred,
        };
      });
      const deckCellProjAtCap = geojsonDataAtCap.data.map((feature: any) => {
        return {
          vertices: feature.wkb_geometry.coordinates, // Polygon vertices
          bm_pred: feature.bm_pred,
        };
      });
      const deckCellProjAbove = geojsonDataAbove.data.map((feature: any) => {
        return {
          vertices: feature.wkb_geometry.coordinates, // Polygon vertices
          bm_pred: feature.bm_pred,
        };
      });
      setBelowCells(deckCellProjBelow);
      setAtCapCells(deckCellProjAtCap);
      setAboveCells(deckCellProjAbove);
    } catch (error) {
      console.error("Error fetching data from Express:", error);
    }
  };

  // const loadCarryingCapacityCells = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8080/api/hexagons");
  //     const below_response = await fetch(
  //       "http://localhost:8080/api//hexagons/bm_pred_below"
  //     );
  //     const at_cap_response = await fetch(
  //       "http://localhost:8080/api//hexagons/bm_pred_at_cap"
  //     );
  //     const above_response = await fetch(
  //       "http://localhost:8080/api//hexagons/bm_pred_above"
  //     );
  //     const json_object = await response.json();
  //     const geojsonData = json_object;

  //     const json_object_below = await below_response.json();
  //     const geojsonDataBelow = json_object_below;

  //     const json_object_at_cap = await at_cap_response.json();
  //     const geojsonDataAtCap = json_object_at_cap;

  //     const json_object_above = await above_response.json();
  //     const geojsonDataAbove = json_object_above;

  //     // THIS BLOCK IS REQUIRED TO CONVERT HEX COORDINATES - no need to understand it
  //     const deckHexProj = geojsonData.map((feature: any) => {
  //       return {
  //         vertices: feature.geometry.coordinates[0], // Polygon vertices
  //         bm_pred: feature.bm_pred,
  //       };
  //     });
  //     const deckHexProjBelow = geojsonDataBelow.map((feature: any) => {
  //       return {
  //         vertices: feature.geometry.coordinates[0], // Polygon vertices
  //         bm_pred: feature.bm_pred,
  //       };
  //     });
  //     const deckHexProjAtCap = geojsonDataAtCap.map((feature: any) => {
  //       return {
  //         vertices: feature.geometry.coordinates[0], // Polygon vertices
  //         bm_pred: feature.bm_pred,
  //       };
  //     });
  //     const deckHexProjAbove = geojsonDataAbove.map((feature: any) => {
  //       return {
  //         vertices: feature.geometry.coordinates[0], // Polygon vertices
  //         bm_pred: feature.bm_pred,
  //       };
  //     });
  //     setCells(deckHexProj);
  //     setBelowCells(deckHexProjBelow);
  //     setAtCapCells(deckHexProjAtCap);
  //     setAboveCells(deckHexProjAbove);
  //   } catch (error) {
  //     console.error("Error fetching data from Express:", error);
  //   }
  // };

  const loadProvinceGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/provincegeo");

      const json_object = await response.json();
      const geojsonData = json_object.data;
      const deckProvinceProj = geojsonData.map((feature: any) => {
        const flattenedArray: number[] =
          feature.province_geometry.coordinates[0].reduce(
            (acc: string | any[], current: any) => acc.concat(current),
            []
          );
        const bounds = flattenedArray.reduce(
          (bbox, coord) => {
            if (!Array.isArray(coord) || coord.length !== 2) {
              console.error("Unexpected coordinate format:", coord);
              return bbox; // Return previous bbox if coord is not valid
            }
            const [lng, lat] = coord;
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
          coordinates: feature.province_geometry.coordinates[0],
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
      const response = await fetch("http://localhost:8080/api/countygeo");
      const json_object = await response.json();
      const geojsonData = json_object.data;
      const deckSoumProj = geojsonData.map((feature: any) => {
        return {
          type: "Polygon",
          coordinates: feature.county_geometry.coordinates[0],
        };
      });
      setSoums(deckSoumProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  const handleZoomToProvince = (
    bounds: [number, number, number, number] | null
  ) => {
    if (map && bounds) {
      map.fitBounds(bounds, {
        padding: 50, // Add padding to ensure the province is not cut off
        maxZoom: 8, // Set a maximum zoom level
        duration: 1500, // Smooth animation duration (in ms)
      });
    }
  };

  const handleMapClick = (
    provinceName: string | null,
    coordinates: number[] | null,
    view: [number, number, number, number] | null
  ) => {
    if (!map) return;
    if (!coordinates && !view) {
      // find province
      const province = provinces.filter((p) => p.name === provinceName)[0];
      console.log(province);
      coordinates = province.coordinates;
      view = province.view;
    }
    if (provinceName && coordinates) {
      handleZoomToProvince(view);
      // Trigger the onProvinceSelect callback
      setSelectedProvince(provinceName);
    }
  };

  // useEffect(() => {
  //   handleMapClick(searched);
  // }, [searched]);

  const loadZScoreCells = async () => {
    try {
      const below_response = await fetch(
        "http://localhost:8080/api/cells/z_score_below"
      );
      const at_cap_response = await fetch(
        "http://localhost:8080/api/cells/z_score_at_cap"
      );
      const above_response = await fetch(
        "http://localhost:8080/api/cells/z_score_above"
      );

      const [json_below, json_at_cap, json_above] = await Promise.all([
        below_response.json(),
        at_cap_response.json(),
        above_response.json(),
      ]);

      setZScoreNegativeCells(
        json_below.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
        }))
      );
      setZScoreZeroCells(
        json_at_cap.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
        }))
      );
      setZScorePositiveCells(
        json_above.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
        }))
      );
    } catch (error) {
      console.error("Error fetching z-score data:", error);
    }
  };

  const loadGrazingRangeCells = async () => {
    try {
      const true_response = await fetch(
        "http://localhost:8080/api/cells/grazing_range_true"
      );
      const false_response = await fetch(
        "http://localhost:8080/api/cells/grazing_range_false"
      );

      const [json_true, json_false] = await Promise.all([
        true_response.json(),
        false_response.json(),
      ]);

      setGrazingTrueCells(
        json_true.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          grazing_range: true,
        }))
      );
      setGrazingFalseCells(
        json_false.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          grazing_range: false,
        }))
      );
    } catch (error) {
      console.error("Error fetching grazing range data:", error);
    }
  };

  useEffect(() => {
    loadCountiesGeometries();
    loadProvinceGeometries();
    loadCarryingCapacityCells();
    loadZScoreCells();
    loadGrazingRangeCells();
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
        handleMapClick(object.name, null, null);
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
    lineWidthMinPixels: 0.8,

    // pickable: true,
    // autoHighlight: true,
  });

  const cellsBelowLayer = new ScatterplotLayer({
    id: "point-layer",
    data: belowCells, // Point Data
    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [0, 170, 60, 200], // Red color for visibility
    pickable: true,
  });
  const cellsAtCapLayer = new ScatterplotLayer({
    id: "point-layer",
    data: atCapCells, // Point Data
    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [255, 140, 90, 200], // Red color for visibility
    pickable: true,
  });
  const cellsAboveLayer = new ScatterplotLayer({
    id: "point-layer",
    data: aboveCells, // Point Data
    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [214, 15, 2, 150], // Red color for visibility
    pickable: true,
  });

  // const cellsBelowLayer = new PolygonLayer({
  //   id: "hexagonBelow-layer",
  //   data: belowCells,
  //   getPolygon: (d) => d.vertices,
  //   stroked: true,
  //   filled: true,
  //   getLineColor: [0, 0, 0],
  //   getFillColor: [0, 170, 60, 200],
  //   lineWidthMinPixels: 1,
  // });

  // const cellsAtCapLayer = new PolygonLayer({
  //   id: "hexagonAtCap-layer",
  //   data: atCapCells,
  //   getPolygon: (d) => d.vertices,
  //   stroked: true,
  //   filled: true,
  //   getLineColor: [0, 0, 0],
  //   getFillColor: [255, 255, 20, 150],
  //   lineWidthMinPixels: 1,
  // });

  // const cellsAboveLayer = new PolygonLayer({
  //   id: "hexagon-above-layer",
  //   data: aboveCells,
  //   getPolygon: (d) => d.vertices,
  //   stroked: true,
  //   filled: true,
  //   getLineColor: [0, 0, 0],
  //   getFillColor: [214, 15, 2, 150],
  //   lineWidthMinPixels: 1,
  // });

  const handleMapLoad = (event: maplibregl.MapLibreEvent) => {
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
    if (showZScoreBelowCells) layers.push(zScoreBelowLayer);
    if (showZScoreAtCapCells) layers.push(zScoreAtCapLayer);
    if (showZScoreAboveCells) layers.push(zScoreAboveLayer);  
    const overlay = new MapboxOverlay({ layers });
    map.addControl(overlay);
    return () => {
      map.removeControl(overlay);
    };
  }, [map, showBelowCells, showAtCapCells, showAboveCells]);

  if (!provinces || (provinces.length === 0 && !soums) || soums.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        // {...viewState}
        mapStyle={MAP_STYLE}
        // style={{ width: "100vw", height: "100vh" }}
        onLoad={handleMapLoad}
        // onMove={(evt) => setViewState(evt.viewState)}
      >
        {/* <NavigationControl position="top-left" /> */}
      </Map>
    </>
  );
};

export default MapComponent;
