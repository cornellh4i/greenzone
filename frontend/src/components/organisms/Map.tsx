import { Map, MapRef } from "react-map-gl/maplibre";
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
  // Removed grazing_range boolean property
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
  const [map, setMap] = useState<MapRef | null>(null);
  const [belowCells, setBelowCells] = useState<CellGeometry[]>([]);
  const [atCapCells, setAtCapCells] = useState<CellGeometry[]>([]);
  const [aboveCells, setAboveCells] = useState<CellGeometry[]>([]);
  const [negativeCells, setNegativeCells] = useState<CellGeometry[]>([]);
  const [zeroCells, setZeroCells] = useState<CellGeometry[]>([]);
  const [positiveCells, setPositiveCells] = useState<CellGeometry[]>([]);
  // Removed grazingTrueCells and grazingFalseCells states

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
          // Removed grazing_range property
        }))
      );
      setAtCapCells(
        json_at_cap_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
        }))
      );
      setAboveCells(
        json_above_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
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
          // Removed grazing_range property
        }))
      );
      setZeroCells(
        json_zero_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
        }))
      );
      setPositiveCells(
        json_positive_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
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
        feature.wkb_geometry.coordinates[0][0].forEach(
          ([lng, lat]: [number, number]) => {
            bounds[0] = Math.min(bounds[0], lng); // Min longitude
            bounds[1] = Math.min(bounds[1], lat); // Min latitude
            bounds[2] = Math.max(bounds[2], lng); // Max longitude
            bounds[3] = Math.max(bounds[3], lat); // Max latitude
          }
        );
        provViews[feature.id] = bounds;
        return {
          type: "Polygon",
          coordinates: feature.wkb_geometry.coordinates[0],
          ID: feature.id,
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

        feature.wkb_geometry.coordinates[0].forEach(
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
          coordinates: feature.wkb_geometry.coordinates[0],
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
      }
    },
  });

  const provinceMaskLayer = new PolygonLayer({
    id: "province-mask-layer",
    data: provinces.filter((prov) => prov.ID !== selectedProvince),
    getPolygon: (d) => d.coordinates,
    filled: true,
    getLineColor: [0, 0, 0, 0],
    getFillColor: [220, 220, 220, 230],
    lineWidthMinPixels: 0,
    pickable: false,
  });

  const soumLayer = new PolygonLayer({
    id: "soum-layer",
    data: soums,
    getPolygon: (d) => d.coordinates,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 0.8,
    pickable: !!selectedProvince,
    autoHighlight: !!selectedProvince,
    highlightColor: [255, 100, 100, 100],
    onClick: ({ object }) => {
      if (object && selectedProvince) {
        setSelectedCounty(object.ID);
      }
    },
  });

  // Modified layers to remove grazing_range filtering
  const cellsBelowLayer = new ScatterplotLayer({
    id: "point-layer",
    data: belowCells, // No longer filtering by grazing_range
    getPosition: (d) => d.vertices,
    getRadius: 3000,
    getFillColor: [0, 170, 60, 200],
    pickable: true,
  });

  const cellsAtCapLayer = new ScatterplotLayer({
    id: "point-layer",
    data: atCapCells, // No longer filtering by grazing_range
    getPosition: (d) => d.vertices,
    getRadius: 3000,
    getFillColor: [255, 140, 90, 200],
    pickable: true,
  });

  const cellsAboveLayer = new ScatterplotLayer({
    id: "point-layer",
    data: aboveCells, // No longer filtering by grazing_range
    getPosition: (d) => d.vertices,
    getRadius: 3000,
    getFillColor: [214, 15, 2, 150],
    pickable: true,
  });

  const cellsNegativeLayer = new ScatterplotLayer({
    id: "point-layer",
    data: negativeCells, // No longer filtering by grazing_range
    getPosition: (d) => d.vertices,
    getRadius: 3000,
    getFillColor: [128, 0, 128, 200],
    pickable: true,
  });

  const cellsZeroLayer = new ScatterplotLayer({
    id: "point-layer",
    data: zeroCells, // No longer filtering by grazing_range
    getPosition: (d) => d.vertices,
    getRadius: 3000,
    getFillColor: [0, 0, 139, 200],
    pickable: true,
  });

  const cellsPositiveLayer = new ScatterplotLayer({
    id: "point-layer",
    data: positiveCells, // No longer filtering by grazing_range
    getPosition: (d) => d.vertices,
    getRadius: 3000,
    getFillColor: [0, 128, 128, 200],
    pickable: true,
  });

  const handleMapLoad = (event: maplibregl.MapLibreEvent) => {
    setMap(event.target as unknown as MapRef);
  };

  useEffect(() => {
    if (!map) return; // Ensure map is loaded
    const layers = [];

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
    layers.push(provinceLayer);
    if (selectedProvince && soums) {
      layers.push(soumLayer);
      layers.push(provinceMaskLayer);
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
        mapStyle={MAP_STYLE}
        onLoad={handleMapLoad}
      ></Map>
    </>
  );
};

export default MapComponent;
