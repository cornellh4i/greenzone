/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Map, MapRef, NavigationControl } from "react-map-gl/maplibre";
import React, { useContext, useState, useEffect } from "react";
import { PolygonLayer, ScatterplotLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Context, LayerType, SelectedType } from "../../utils/global";

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
type Bounds = [number, number, number, number];

interface ProvinceView {
  [provinceId: number]: Bounds;
}
interface CountyView {
  [countyId: number]: Bounds;
}
const INITIAL_VIEW_BOUNDS: [number, number, number, number] = [87, 41, 119, 52];
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapComponent: React.FC = () => {
  const [provinces, setProvinces] = useState<Geometry[]>([]);
  const [soums, setSoums] = useState<Geometry[]>([]);
  const [provinceViews, setProvinceViews] = useState<ProvinceView | null>(null);
  const [countyViews, setCountyViews] = useState<CountyView | null>(null);
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
  const [grazingFalseCells, setGrazingFalseCells] = useState<CellGeometry[]>([]);
  const context = useContext(Context);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    selectedCounty,
    selectedProvince,
    setSelectedCounty,
    setSelectedProvince,
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
    selectedYear,
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
          grazing_range: feature.grazing_range, // Include grazing boolean value
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
          grazing_range: feature.grazing_range, // Include grazing boolean value
        }))
      );
      setZeroCells(
        json_zero_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range, // Include grazing boolean value
        }))
      );
      setPositiveCells(
        json_positive_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range, // Include grazing boolean value
        }))
      );
    } catch (error) {
      console.error("Error fetching z-score data:", error);
    }
  };

  const loadProvinceGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/provincegeo");
      const provViews: ProvinceView = {};
      const json_object = await response.json();
      const geojsonData = json_object.data;
      const deckProvinceProj = geojsonData.map((feature: any) => {
        const bounds: Bounds = [Infinity, Infinity, -Infinity, -Infinity];

        feature.province_geometry.coordinates[0][0].forEach(
          ([lng, lat]: [number, number]) => {
            bounds[0] = Math.min(bounds[0], lng); // Min longitude
            bounds[1] = Math.min(bounds[1], lat); // Min latitude
            bounds[2] = Math.max(bounds[2], lng); // Max longitude
            bounds[3] = Math.max(bounds[3], lat); // Max latitude
          }
        );
        provViews[feature.province_id] = bounds;
        return {
          type: "Polygon",
          coordinates: feature.province_geometry.coordinates[0],
          ID: feature.province_id,
          view: bounds,
          areaType: SelectedType.Province,
        };
      });
      setProvinceViews(provViews);
      setProvinces(deckProvinceProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  //  change  to load countie for specific province
  const loadCountiesGeometriesByProvince = async (province_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/county/geom/${province_id}`
      );
      const json_object = await response.json();
      const soumViews: CountyView = {};
      const geojsonData = json_object.data;
      const deckSoumProj = geojsonData.map((feature: any) => {
        const bounds: Bounds = [Infinity, Infinity, -Infinity, -Infinity];

        feature.county_geometry.coordinates[0].forEach(
          ([lng, lat]: [number, number]) => {
            bounds[0] = Math.min(bounds[0], lng); // Min longitude
            bounds[1] = Math.min(bounds[1], lat); // Min latitude
            bounds[2] = Math.max(bounds[2], lng); // Max longitude
            bounds[3] = Math.max(bounds[3], lat); // Max latitude
          }
        );
        soumViews[feature.county_id] = bounds;
        return {
          type: "Polygon",
          coordinates: feature.county_geometry.coordinates[0],
          ID: feature.county_id,
          view: bounds,
          areaType: SelectedType.County,
        };
      });
      setCountyViews(soumViews);
      setSoums(deckSoumProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  const handleZoom = (bounds: [number, number, number, number] | null) => {
    if (map && bounds) {
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: selectedCounty ? 9 : selectedProvince ? 8 : 5.5,
        duration: 1000, // Smooth animation duration (in ms)
      });
    }
  };

  const ZoomProcess = () => {
    // Province is clicked (only if no province is already selected):
    if (selectedProvince) {
      loadCountiesGeometriesByProvince(selectedProvince);

      // Use optional chaining and type assertion
      const provinceView = provinceViews?.[selectedProvince] as
        | Bounds
        | undefined;

      if (provinceView) {
        handleZoom(provinceView);
      }
      return;
    }
    // County is clicked (only if a province is already selected)
    if (selectedProvince && selectedCounty) {
      const countyView = countyViews?.[selectedCounty] as Bounds | undefined;

      if (countyView) {
        handleZoom(countyView);
      }
      return;
    }
  };

  useEffect(() => {
    ZoomProcess();
  }, [selectedCounty, selectedProvince]);

  useEffect(() => {
    loadProvinceGeometries();
    loadCarryingCapacityCells();
    loadZScoreCells();
  }, [selectedYear]);

  const provinceLayer = new PolygonLayer({
    id: "province-layer",
    data: provinces,
    getPolygon: (d) => d.coordinates,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 1,
    pickable: !selectedProvince,
    autoHighlight: !selectedProvince,
    highlightColor: [255, 100, 100, 100],
    onClick: ({ object }) => {
      if (object && !selectedProvince) {
        setSelectedProvince(object.ID);
        // handleMapClick(object.view, object.ID, object.areaType);
      }
    },
  });

  const provinceMaskLayer = new PolygonLayer({
    id: "province-mask-layer",
    data: provinces.filter((prov) => prov.ID !== selectedProvince),
    getPolygon: (d) => d.coordinates,
    filled: true,
    getLineColor: [0, 0, 0, 0],
    getFillColor: [255, 255, 255,  150],
    lineWidthMinPixels: 0,
    pickable: false,
  });

  // const soumLayer = new PolygonLayer({
  const soumLayer = new PolygonLayer({
    id: "soum-layer",
    data: soums,
    getPolygon: (d) => d.coordinates,
    getLineColor: [0, 0, 0, 70],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 0.8,
    pickable: !!selectedProvince,
    autoHighlight: !!selectedProvince,
    highlightColor: [255, 100, 100, 100],
    onClick: ({ object }) => {
      if (object && selectedProvince) {
        setSelectedCounty(object.ID);
      }
      // } else if (!object) {
      //   // Click outside polygons
      //   handleMapClick(null, null, null);
      // }
    },
  });

  const cellsBelowLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
      ? belowCells
      : belowCells.filter((d) => d.grazing_range == grazingRange), // Point Data
    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [0, 170, 60, 200], // Red color for visibility
    pickable: true,
  });

  const cellsAtCapLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
      ? atCapCells
      : atCapCells.filter((d) => d.grazing_range == grazingRange), // Point Data
    getPosition: (d) => d.vertices,
    getRadius: 5000, // Adjust size
    getFillColor: [255, 140, 90, 200], // Red color for visibility
    pickable: true,
  });
  const cellsAboveLayer = new ScatterplotLayer({
    id: "point-layer",
    data: !grazingRange
      ? aboveCells
      : aboveCells.filter((d) => d.grazing_range == grazingRange),
    getPosition: (d) => {
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
      : negativeCells.filter((d) => d.grazing_range == grazingRange),
    getPosition: (d) => {
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
      : zeroCells.filter((d) => d.grazing_range == grazingRange),
    getPosition: (d) => {
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
      : positiveCells.filter((d) => d.grazing_range == grazingRange),
    getPosition: (d) => d.vertices,
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
    if (selectedProvince && soums) {
      layers.push(soumLayer);
      layers.push(provinceMaskLayer);
    }
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
  }, [
    map,
    provinces,
    soums,
    selectedProvince,
    selectedCounty,
    showBelowCells,
    showAtCapCells,
    showAboveCells,
    showNegativeCells,
    showZeroCells,
    showPositiveCells,
    grazingRange,
    selectedYear,
    selectedLayerType,
  ]);

  if (!provinces || provinces.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        // {...viewState}
        mapStyle={MAP_STYLE}
        onLoad={handleMapLoad}
        // onMove={(evt) => setViewState(evt.viewState)}
      >
        {/* <NavigationControl position="top-left" /> */}
      </Map>
    </>
  );
};

export default MapComponent;
