/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck comment
import { Map, MapRef, NavigationControl } from "react-map-gl/maplibre";
import React, { useContext, useState, useEffect } from "react";
import { PolygonLayer, ScatterplotLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Context, LayerType, SelectedType } from "../utils/global";

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
  ID: number;
  coordinates: number[];
  areaType: SelectedType | null;
}
// For the Geometrical Shapes on the Maps like Province And Counties
interface CellGeometry {
  type: string;
  name: string;
  coordinates: number[];
  vertices: [number, number][];
  grazing_range: boolean; // Add grazing boolean value
}

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapComponent: React.FC<{ onMapReady?: (zoomToCounty: (countyId: number) => void) => void }> = ({ onMapReady }) => {
  const [provinces, setProvinces] = useState<Geometry[]>([]);
  const [soums, setSoums] = useState<Geometry[]>([]);
  // const [showCells, setShowCells] = useState(false);
  const [map, setMap] = useState<MapRef | null>(null);
  // const [cells, setCells] = useState<CellGeometry[]>([]);
  const [belowCells, setBelowCells] = useState<CellGeometry[]>([]);
  const [atCapCells, setAtCapCells] = useState<CellGeometry[]>([]);
  const [aboveCells, setAboveCells] = useState<CellGeometry[]>([]);
  const [negativeCells, setNegativeCells] = useState<CellGeometry[]>([]);
  const [zeroCells, setZeroCells] = useState<CellGeometry[]>([]);
  const [positiveCells, setPositiveCells] = useState<CellGeometry[]>([]);
  const [grazingTrueCells, setGrazingTrueCells] = useState<CellGeometry[]>([]);
  const [grazingFalseCells, setGrazingFalseCells] = useState<CellGeometry[]>(
    []
  );
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    setSelectedProvince,
    setSelectedCounty,
    setShowBelowCells,
    setShowAtCapCells,
    setShowAboveCells,
    showAboveCells,
    showBelowCells,
    showAtCapCells,
    setShowPositiveCells,
    setShowNegativeCells,
    setShowZeroCells,
    showPositiveCells,
    showNegativeCells,
    showZeroCells,
    selectedLayerType,
    setSelectedLayerType,
    grazingRange,
    selectedYear
  } = context;
  const loadCarryingCapacityCells = async () => {
    try {
      const below_response = await fetch(
        `http://localhost:8080/api/cells/${selectedYear}/carrying_capacity/0/0.4`
      );
      const at_cap_response = await fetch(
        `http://localhost:8080/api/cells/${selectedYear}/carrying_capacity/0.4/0.6`
      );
      const above_response = await fetch(
        `http://localhost:8080/api/cells/${selectedYear}/carrying_capacity/0.6/1`
      );

      const [json_below_response, json_at_cap_response, json_above_response] =
        await Promise.all([
          below_response.json(),
          at_cap_response.json(),
          above_response.json(),
        ]);
      setBelowCells(
        json_below_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range, // Include grazing boolean value
        }))
      );
      setAtCapCells(
        json_at_cap_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,// Include grazing boolean value
        }))
      );
      setAboveCells(
        json_above_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range, // Include grazing boolean value
        }))
      );
    } catch (error) {
      console.error("Error fetching data from Express:", error);
    }
  };
  const loadZScoreCells = async () => {
    try {
      const negative_response = await fetch(
        `http://localhost:8080/api/cells/${selectedYear}/z_score/0/0.4`
      );
      const zero_response = await fetch(
        `http://localhost:8080/api/cells/${selectedYear}/z_score/0.4/0.6`
      );
      const positive_response = await fetch(
        `http://localhost:8080/api/cells/${selectedYear}/z_score/0.6/1`
      );
      console.log(negative_response)
      const [
        json_negative_response,
        json_zero_response,
        json_positive_response,
      ] = await Promise.all([
        negative_response.json(),
        zero_response.json(),
        positive_response.json(),
      ]);
      setNegativeCells(
        json_negative_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,  // Include grazing boolean value
        }))
      );
      setZeroCells(
        json_zero_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,  // Include grazing boolean value

        }))
      );
      setPositiveCells(
        json_positive_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,  // Include grazing boolean value
        }))
      );
    } catch (error) {
      console.error("Error fetching z-score data:", error);
    }
  };

  const loadProvinceGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/provincegeo");

      const json_object = await response.json();
      const geojsonData = json_object.data;
      const deckProvinceProj = geojsonData.map((feature: any) => {
        const bounds = [Infinity, Infinity, -Infinity, -Infinity];

        feature.province_geometry.coordinates[0][0].forEach((
          [lng, lat]: [number, number]) => {
            console.log("Coordinates:", lng, lat);
            bounds[0] = Math.min(bounds[0], lng); // Min longitude
            bounds[1] = Math.min(bounds[1], lat); // Min latitude
            bounds[2] = Math.max(bounds[2], lng); // Max longitude
            bounds[3] = Math.max(bounds[3], lat); // Max latitude
      });
        return {
          type: "Polygon",
          coordinates: feature.province_geometry.coordinates[0],
          provinceID: feature.province_id,
          view: bounds,
          areaType: SelectedType.Province,
        };
      });
      setProvinces(deckProvinceProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  /*const loadCountiesGeometries = async () => {
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
  };*/
  const loadCountiesGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/countygeo");
      const json_object = await response.json();
      const geojsonData = json_object.data;
      const deckSoumProj = geojsonData.map((feature: any) => {
        // Calculate bounds from coordinates for zooming
        // const flattenedArray = reduce(
        //   (acc, current) => acc.concat(current),
        //   []
        // );
        // console.log(feature.county_geometry.coordinates[0])
        const bounds = [Infinity, Infinity, -Infinity, -Infinity];

        feature.county_geometry.coordinates[0].forEach((
          [lng, lat]: [number, number]) => {
            bounds[0] = Math.min(bounds[0], lng); // Min longitude
            bounds[1] = Math.min(bounds[1], lat); // Min latitude
            bounds[2] = Math.max(bounds[2], lng); // Max longitude
            bounds[3] = Math.max(bounds[3], lat); // Max latitude
      });

        return {
          type: "Polygon",
          coordinates: feature.county_geometry.coordinates[0],
          countyID: feature.county_id,
          view: bounds,
          areaType: SelectedType.County,
        };
      });
      setSoums(deckSoumProj);
    } catch (error) {
      console.error("Error fetching county data:", error);
    }
  };


  const handleZoom = (
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
    view: [number, number, number, number] | null,
    ID: number,
    areaType: SelectedType | null,
  ) => {
    console.log(view)
    if (areaType === "province") {
      setSelectedProvince(ID);
  } if (areaType == "county") {
      setSelectedCounty(ID);
    }
    if (view) {
      console.log(view)
      handleZoom(view);
  }};

  useEffect(() => {
    loadCountiesGeometries();
    loadProvinceGeometries();
    loadCarryingCapacityCells();
    loadZScoreCells();
    // loadGrazingRangeCells();
  }, [selectedYear]);

  const provinceLayer = new PolygonLayer({
    id: "province-layer",
    data: provinces,
    getPolygon: (d) => d.coordinates,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 1,
    pickable: false,
    autoHighlight: false,
    highlightColor: [1000, 20, 20, 20],
    onClick: ({ object }) => {
      if (object) {
        handleMapClick(object.view, object.provinceID, object.areaType);
      } else {
        handleMapClick(null, null, null, null); // Click outside the polygons
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
    pickable: true,
    autoHighlight: true,
    onClick: ({ object }) => {
      if (object) {
        handleMapClick(object.view, object.countyID, object.areaType);
      } else {
        handleMapClick(null, null, null, null); // Click outside the polygons
      }
    },
    

    // pickable: true,
    // autoHighlight: true,
  });

  const cellsBelowLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
    ? belowCells
    : belowCells.filter(d => d.grazing_range == grazingRange), // Point Data
    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [0, 170, 60, 200], // Red color for visibility
    pickable: true,
  });
  
  const cellsAtCapLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
    ? atCapCells
    : atCapCells.filter(d => d.grazing_range == grazingRange), // Point Data
    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [255, 140, 90, 200], // Red color for visibility
    pickable: true,
  });
  const cellsAboveLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
    ? aboveCells
    : aboveCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => {
      return d.vertices;
    },
    getRadius: 5000, // Adjust size
    getFillColor: [214, 15, 2, 150], // Red color for visibility
    pickable: true,
  });

  const cellsNegativeLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
    ? negativeCells
    : negativeCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => {
      return d.vertices;
    },
    getRadius: 5000, // Adjust size
    getFillColor: [128, 0, 128, 200], // Purple color for visibility

    pickable: true,
  });
  const cellsZeroLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
    ? zeroCells
    : zeroCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => {
      return d.vertices;
    },
    getRadius: 5000, // Adjust size
    getFillColor: [0, 0, 139, 200], // Blue color for visibility

    pickable: true,
  });
  const cellsPositiveLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
    ? positiveCells
    : positiveCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [0, 128, 128, 200], // Teal color

    pickable: true,
  });

  const handleMapLoad = (event: maplibregl.MapLibreEvent) => {
    setMap(event.target as unknown as MapRef);
  };

  useEffect(() => {
    if (!map) return; // Ensure map is loaded
    const layers = [];
    layers.push(provinceLayer);
    layers.push(soumLayer);
    if (selectedLayerType == LayerType.ZScore) {
      if (showNegativeCells) layers.push(cellsNegativeLayer);
      if (showZeroCells) layers.push(cellsZeroLayer);
      if (showPositiveCells) layers.push(cellsPositiveLayer);
    }
    if (selectedLayerType == LayerType.CarryingCapacity) {
      if (showBelowCells) layers.push(cellsBelowLayer);
      if (showAtCapCells) layers.push(cellsAtCapLayer);
      if (showAboveCells) layers.push(cellsAboveLayer);
    }

    const overlay = new MapboxOverlay({ layers });
    map.addControl(overlay);
    return () => {
      map.removeControl(overlay);
    };
  },
    [
      map,
      showBelowCells,
      showAtCapCells,
      showAboveCells,
      showNegativeCells,
      showZeroCells,
      showPositiveCells,
      grazingRange,
      selectedYear
    ]);
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(handleZoom);
    }
  }, [map, onMapReady, soums]);

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
