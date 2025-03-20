// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// //@ts-nocheck comment
// import { Map, MapRef, NavigationControl } from "react-map-gl/maplibre";
// import React, { useContext, useState, useEffect } from "react";
// import { PolygonLayer, ScatterplotLayer } from "deck.gl";
// import { MapboxOverlay } from "@deck.gl/mapbox";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import { Context, LayerType, SelectedType } from "../utils/global";

// const INITIAL_VIEW_STATE = {
//   latitude: 46.8625,
//   longitude: 103.8467,
//   zoom: 5.5,
//   bearing: 0,
//   pitch: 0,
// };

// // For the Geometrical Shapes on the Maps like Province And Counties
// interface Geometry {
//   view: [number, number, number, number] | null;
//   type: string;
//   ID: number;
//   coordinates: number[];
//   areaType: SelectedType | null;
// }
// // For the Geometrical Shapes on the Maps like Province And Counties
// interface CellGeometry {
//   type: string;
//   name: string;
//   coordinates: number[];
//   vertices: [number, number][];
//   grazing_range: boolean; // Add grazing boolean value
// }

// const MAP_STYLE =
//   "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

//   const MapComponent: React.FC<{ onMapReady?: (zoomToCounty: (countyId: number) => void) => void }> = ({ onMapReady }) => {
//     const [provinces, setProvinces] = useState<Geometry[]>([]);
//   const [soums, setSoums] = useState<Geometry[]>([]);
//   // const [showCells, setShowCells] = useState(false);
//   const [map, setMap] = useState<MapRef | null>(null);
//   // const [cells, setCells] = useState<CellGeometry[]>([]);
//   const [belowCells, setBelowCells] = useState<CellGeometry[]>([]);
//   const [atCapCells, setAtCapCells] = useState<CellGeometry[]>([]);
//   const [aboveCells, setAboveCells] = useState<CellGeometry[]>([]);
//   const [negativeCells, setNegativeCells] = useState<CellGeometry[]>([]);
//   const [zeroCells, setZeroCells] = useState<CellGeometry[]>([]);
//   const [positiveCells, setPositiveCells] = useState<CellGeometry[]>([]);
//   const [grazingTrueCells, setGrazingTrueCells] = useState<CellGeometry[]>([]);
//   const [grazingFalseCells, setGrazingFalseCells] = useState<CellGeometry[]>(
//     []
//   );
//   const context = useContext(Context);

//   if (!context) {
//     throw new Error("Context must be used within a ContextProvider");
//   }
//   const {
//     setSelectedProvince,
//     setSelectedCounty,
//     setShowBelowCells,
//     setShowAtCapCells,
//     setShowAboveCells,
//     showAboveCells,
//     showBelowCells,
//     showAtCapCells,
//     setShowPositiveCells,
//     setShowNegativeCells,
//     setShowZeroCells,
//     showPositiveCells,
//     showNegativeCells,
//     showZeroCells,
//     selectedLayerType,
//     setSelectedLayerType,
//     grazingRange,
//     selectedYear
//   } = context;
//   const loadCarryingCapacityCells = async () => {
//     try {
//       const below_response = await fetch(
//         `http://localhost:8080/api/cells/${selectedYear}/carrying_capacity/0/0.4`
//       );
//       const at_cap_response = await fetch(
//         `http://localhost:8080/api/cells/${selectedYear}/carrying_capacity/0.4/0.6`
//       );
//       const above_response = await fetch(
//         `http://localhost:8080/api/cells/${selectedYear}/carrying_capacity/0.6/1`
//       );

//       const [json_below_response, json_at_cap_response, json_above_response] =
//         await Promise.all([
//           below_response.json(),
//           at_cap_response.json(),
//           above_response.json(),
//         ]);
//       setBelowCells(
//         json_below_response.data.map((feature: any) => ({
//           vertices: feature.wkb_geometry.coordinates,
//           z_score: feature.z_score,
//           grazing_range: feature.grazing_range, // Include grazing boolean value
//         }))
//       );
//       setAtCapCells(
//         json_at_cap_response.data.map((feature: any) => ({
//           vertices: feature.wkb_geometry.coordinates,
//           z_score: feature.z_score,
//           grazing_range: feature.grazing_range,// Include grazing boolean value
//         }))
//       );
//       setAboveCells(
//         json_above_response.data.map((feature: any) => ({
//           vertices: feature.wkb_geometry.coordinates,
//           z_score: feature.z_score,
//           grazing_range: feature.grazing_range, // Include grazing boolean value
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching data from Express:", error);
//     }
//   };
//   const loadZScoreCells = async () => {
//     try {
//       const negative_response = await fetch(
//         `http://localhost:8080/api/cells/${selectedYear}/z_score/0/0.4`
//       );
//       const zero_response = await fetch(
//         `http://localhost:8080/api/cells/${selectedYear}/z_score/0.4/0.6`
//       );
//       const positive_response = await fetch(
//         `http://localhost:8080/api/cells/${selectedYear}/z_score/0.6/1`
//       );
//       console.log(negative_response)
//       const [
//         json_negative_response,
//         json_zero_response,
//         json_positive_response,
//       ] = await Promise.all([
//         negative_response.json(),
//         zero_response.json(),
//         positive_response.json(),
//       ]);
//       setNegativeCells(
//         json_negative_response.data.map((feature: any) => ({
//           vertices: feature.wkb_geometry.coordinates,
//           z_score: feature.z_score,
//           grazing_range: feature.grazing_range,  // Include grazing boolean value
//         }))
//       );
//       setZeroCells(
//         json_zero_response.data.map((feature: any) => ({
//           vertices: feature.wkb_geometry.coordinates,
//           z_score: feature.z_score,
//           grazing_range: feature.grazing_range,  // Include grazing boolean value

//         }))
//       );
//       setPositiveCells(
//         json_positive_response.data.map((feature: any) => ({
//           vertices: feature.wkb_geometry.coordinates,
//           z_score: feature.z_score,
//           grazing_range: feature.grazing_range,  // Include grazing boolean value
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching z-score data:", error);
//     }
//   };

//   const loadProvinceGeometries = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/provincegeo");

//       const json_object = await response.json();
//       const geojsonData = json_object.data;
//       const deckProvinceProj = geojsonData.map((feature: any) => {
//         const bounds = [Infinity, Infinity, -Infinity, -Infinity];

//         feature.province_geometry.coordinates[0][0].forEach((
//           [lng, lat]: [number, number]) => {
//             console.log("Coordinates:", lng, lat);
//             bounds[0] = Math.min(bounds[0], lng); // Min longitude
//             bounds[1] = Math.min(bounds[1], lat); // Min latitude
//             bounds[2] = Math.max(bounds[2], lng); // Max longitude
//             bounds[3] = Math.max(bounds[3], lat); // Max latitude
//       });
//         return {
//           type: "Polygon",
//           coordinates: feature.province_geometry.coordinates[0],
//           ID: feature.province_id,
//           view: bounds,
//           areaType: SelectedType.Province,
//         };
//       });
//       setProvinces(deckProvinceProj);
//     } catch (error) {
//       console.error("Error fetching province data:", error);
//     }
//   };

//   const loadCountiesGeometries = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/countygeo");
//       const json_object = await response.json();
//       const geojsonData = json_object.data;
//       const deckSoumProj = geojsonData.map((feature: any) => {
//         const bounds = [Infinity, Infinity, -Infinity, -Infinity];

//         feature.county_geometry.coordinates[0].forEach((
//           [lng, lat]: [number, number]) => {
//             bounds[0] = Math.min(bounds[0], lng); // Min longitude
//             bounds[1] = Math.min(bounds[1], lat); // Min latitude
//             bounds[2] = Math.max(bounds[2], lng); // Max longitude
//             bounds[3] = Math.max(bounds[3], lat); // Max latitude
//       });
//         return {
//           type: "Polygon",
//           coordinates: feature.county_geometry.coordinates[0],
//           ID: feature.county_id,
//           view: bounds,
//           areaType: SelectedType.County,
//         };
//       });
//       setSoums(deckSoumProj);
//     } catch (error) {
//       console.error("Error fetching province data:", error);
//     }
//   };

//   const handleZoom = (
//     bounds: [number, number, number, number] | null
//   ) => {
//     if (map && bounds) {
//       map.fitBounds(bounds, {
//         padding: 50, // Add padding to ensure the province is not cut off
//         maxZoom: selectedCounty ? 10 : selectedProvince ? 8 : 5.5, // Set a maximum zoom level
//         duration: 1500, // Smooth animation duration (in ms)
//       });
//     }
//   };

//   const handleMapClick = (
//     view: [number, number, number, number] | null,
//     ID: number| null,
//     areaType: SelectedType | null
//   ) => {
//     if (areaType === SelectedType.Province && !selectedProvince) {
//       setSelectedProvince(ID);
//       setSelectedCounty(null);
//     } else if (areaType === SelectedType.County && selectedProvince) {
//       setSelectedCounty(ID);
//     }
  
//     if (view) {
//       handleZoom(view);
//     }
//   };

//   useEffect(() => {
//     loadCountiesGeometries();
//     loadProvinceGeometries();
//     loadCarryingCapacityCells();
//     loadZScoreCells();
//     // loadGrazingRangeCells();
//   }, [selectedYear]);

//   const provinceLayer = new PolygonLayer({
//     id: "province-layer",
//     data: provinces,
//     getPolygon: (d) => d.coordinates,
//     filled: true,
//     getLineColor: [0, 0, 0],
//     getFillColor: [0, 0, 0, 0],
//     lineWidthMinPixels: 1,
//     pickable: !selectedProvince,
//     autoHighlight: !selectedProvince,
//     highlightColor: [1000, 20, 20, 20],
//     onClick: ({ object }) => {
//       if (object) {
//         handleMapClick(object.view, object.ID, object.areaType);
//       } else {
//         handleMapClick(null, null, null, null); // Click outside the polygons
//       }
//     },
//   });
//   const soumLayer = new PolygonLayer({
//     id: "soum-layer",
//     data: soums,
//     getPolygon: (d) => d.coordinates,
//     // filled: true,
//     getLineColor: [0, 0, 0, 70],
//     getFillColor: [0, 0, 0, 0],
//     lineWidthMinPixels: 0.8,
//     pickable: !selectedProvince,
//     autoHighlight: !selectedProvince,
//     onClick: ({ object }) => {
//       if (object) {
//         handleMapClick(object.view, object.ID, object.areaType);
//       } else {
//         handleMapClick(null, null, null, null); // Click outside the polygons
//       }
//     },
//   });



//   const cellsBelowLayer = new ScatterplotLayer({
//     id: "point-layer",
//     data: !grazingRange
//     ? belowCells
//     : belowCells.filter(d => d.grazing_range == grazingRange), // Point Data
//     getPosition: (d) => d.vertices,
//     getRadius: 5000, // Adjust size
//     getFillColor: [0, 170, 60, 200], // Red color for visibility
//     pickable: true,
//   });
  
//   const cellsAtCapLayer = new ScatterplotLayer({
//     id: "point-layer",
//     data: !grazingRange
//     ? atCapCells
//     : atCapCells.filter(d => d.grazing_range == grazingRange), // Point Data
//     getPosition: (d) => d.vertices,
//     getRadius: 5000, // Adjust size
//     getFillColor: [255, 140, 90, 200], // Red color for visibility
//     pickable: true,
//   });
//   const cellsAboveLayer = new ScatterplotLayer({
//     id: "point-layer",
//     data: !grazingRange
//     ? aboveCells
//     : aboveCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => {
//       return d.vertices;
//     },
//     getRadius: 5000, // Adjust size
//     getFillColor: [214, 15, 2, 150], // Red color for visibility
//     pickable: true,
//   });

//   const cellsNegativeLayer = new ScatterplotLayer({
//     id: "point-layer",
//     data: !grazingRange
//     ? negativeCells
//     : negativeCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => {
//       return d.vertices;
//     },
//     getRadius: 5000, // Adjust size
//     getFillColor: [128, 0, 128, 200], // Purple color for visibility

//     pickable: true,
//   });
//   const cellsZeroLayer = new ScatterplotLayer({
//     id: "point-layer",
//     data: !grazingRange
//     ? zeroCells
//     : zeroCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => {
//       return d.vertices;
//     },
//     getRadius: 5000, // Adjust size
//     getFillColor: [0, 0, 139, 200], // Blue color for visibility

//     pickable: true,
//   });
//   const cellsPositiveLayer = new ScatterplotLayer({
//     id: "point-layer",
//     data: !grazingRange
//     ? positiveCells
//     : positiveCells.filter(d => d.grazing_range == grazingRange),    getPosition: (d) => d.vertices,
//     getRadius: 5000, // Adjust size
//     getFillColor: [0, 128, 128, 200], // Teal color

//     pickable: true,
//   });

//   const handleMapLoad = (event: maplibregl.MapLibreEvent) => {
//     setMap(event.target as unknown as MapRef);
//   };

//   useEffect(() => {
//     if (!map) return; // Ensure map is loaded
//     const layers = [];
//     layers.push(provinceLayer);
//     if (selectedProvince) {
//       layers.push(soumLayer); // Add county layer only if a province is selected
//     }
//     if (selectedLayerType === LayerType.ZScore) {
//       if (showNegativeCells) layers.push(cellsNegativeLayer);
//       if (showZeroCells) layers.push(cellsZeroLayer);
//       if (showPositiveCells) layers.push(cellsPositiveLayer);
//     }
//     if (selectedLayerType === LayerType.CarryingCapacity) {
//       if (showBelowCells) layers.push(cellsBelowLayer);
//       if (showAtCapCells) layers.push(cellsAtCapLayer);
//       if (showAboveCells) layers.push(cellsAboveLayer);
//     }

//     const overlay = new MapboxOverlay({ layers });
//     map.addControl(overlay);
//     return () => {
//       map.removeControl(overlay);
//     };
//   }, [
//     map,
//     selectedProvince,
//     showBelowCells,
//     showAtCapCells,
//     showAboveCells,
//     showNegativeCells,
//     showZeroCells,
//     showPositiveCells,
//     grazingRange,
//     selectedYear,
//   ]);

//   useEffect(() => {
//     if (map && onMapReady) {
//       onMapReady(handleZoom);
//     }
//   }, [map, onMapReady, soums]);

//   if (!provinces || (provinces.length === 0 && !soums) || soums.length === 0) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <Map
//         id="map"
//         initialViewState={INITIAL_VIEW_STATE}
//         // {...viewState}
//         mapStyle={MAP_STYLE}
//         // style={{ width: "100vw", height: "100vh" }}
//         onLoad={handleMapLoad}
//         // onMove={(evt) => setViewState(evt.viewState)}
//       >
//         {/* <NavigationControl position="top-left" /> */}
//       </Map>
//     </>
//   );
// };

// export default MapComponent;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Map, MapRef, NavigationControl } from "react-map-gl/maplibre";
import React, { useContext, useState, useEffect } from "react";
import { PolygonLayer, ScatterplotLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Context, LayerType, SelectedType } from "../utils/global";

/** 
 * This bounding box is used when you need to reset the map to show the entire country (Mongolia).
 * [minLng, minLat, maxLng, maxLat]
 */
const INITIAL_VIEW_BOUNDS: [number, number, number, number] = [87, 41, 119, 52];

/** 
 * Initial camera view for the map.
 */
const INITIAL_VIEW_STATE = {
  latitude: 46.8625,
  longitude: 103.8467,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
};

/**
 * Describes the geometry for provinces or counties.
 */
interface Geometry {
  view: [number, number, number, number] | null;  // bounding box for zoom
  type: string;
  ID: number;
  coordinates: number[];
  areaType: SelectedType | null;
  // If your county data includes a 'province_id', add below so you can filter which soums belong to which province:
  // province_id?: number;
}

/**
 * Describes a point geometry for carrying capacity / z-score layers.
 */
interface CellGeometry {
  type: string;
  name: string;
  coordinates: number[];
  vertices: [number, number][];
  grazing_range: boolean;
  z_score?: number; 
}

/** URL for base map style */
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

/**
 * Optional helper if your county data has a `province_id` you can match.
 * Without this, you'd need some other approach to filter soums to a single province.
 */
function belongsToProvince(soum: Geometry, selectedProvinceId: number) {
  // If your data has an explicit province_id for each county, use that:
  // return soum.province_id === selectedProvinceId;
  //
  // If not, you may need a different way to check ownership, e.g., a naming convention or a separate mapping.
  // For now, we'll simply return true so you can refine with your real logic:
  return true;
}

const MapComponent: React.FC<{
  onMapReady?: (zoomToCounty: (countyId: number) => void) => void;
}> = ({ onMapReady }) => {
  /**
   * State for province and county polygons
   */
  const [provinces, setProvinces] = useState<Geometry[]>([]);
  const [soums, setSoums] = useState<Geometry[]>([]);

  /**
   * State for the map instance
   */
  const [map, setMap] = useState<MapRef | null>(null);

  /**
   * State for carrying capacity / z-score cells
   */
  const [belowCells, setBelowCells] = useState<CellGeometry[]>([]);
  const [atCapCells, setAtCapCells] = useState<CellGeometry[]>([]);
  const [aboveCells, setAboveCells] = useState<CellGeometry[]>([]);
  const [negativeCells, setNegativeCells] = useState<CellGeometry[]>([]);
  const [zeroCells, setZeroCells] = useState<CellGeometry[]>([]);
  const [positiveCells, setPositiveCells] = useState<CellGeometry[]>([]);
  const [grazingTrueCells, setGrazingTrueCells] = useState<CellGeometry[]>([]);
  const [grazingFalseCells, setGrazingFalseCells] = useState<CellGeometry[]>([]);

  /**
   * Pull in the global context states
   */
  const context = useContext(Context);
  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }
  const {
    // selection
    selectedProvince,
    setSelectedProvince,
    selectedCounty,
    setSelectedCounty,

    // toggles for showing layers
    showBelowCells,
    setShowBelowCells,
    showAtCapCells,
    setShowAtCapCells,
    showAboveCells,
    setShowAboveCells,
    showNegativeCells,
    setShowNegativeCells,
    showZeroCells,
    setShowZeroCells,
    showPositiveCells,
    setShowPositiveCells,

    // other context items
    selectedLayerType,
    setSelectedLayerType,
    grazingRange,
    selectedYear,
  } = context;

  /**
   * Load carrying capacity data for the selected year
   */
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

      const [jsonBelow, jsonAtCap, jsonAbove] = await Promise.all([
        below_response.json(),
        at_cap_response.json(),
        above_response.json(),
      ]);

      setBelowCells(
        jsonBelow.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,
        }))
      );
      setAtCapCells(
        jsonAtCap.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,
        }))
      );
      setAboveCells(
        jsonAbove.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,
        }))
      );
    } catch (error) {
      console.error("Error fetching carrying capacity data:", error);
    }
  };

  /**
   * Load Z-Score data for the selected year
   */
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
        jsonNegative,
        jsonZero,
        jsonPositive,
      ] = await Promise.all([
        negative_response.json(),
        zero_response.json(),
        positive_response.json(),
      ]);

      setNegativeCells(
        jsonNegative.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,
        }))
      );
      setZeroCells(
        jsonZero.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,
        }))
      );
      setPositiveCells(
        jsonPositive.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          grazing_range: feature.grazing_range,
        }))
      );
    } catch (error) {
      console.error("Error fetching z-score data:", error);
    }
  };

  /**
   * Loads each province geometry from the server
   */
  const loadProvinceGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/provincegeo");
      const jsonObject = await response.json();
      const geojsonData = jsonObject.data;

      const deckProvinceProj = geojsonData.map((feature: any) => {
        const bounds = [Infinity, Infinity, -Infinity, -Infinity];
        // Example: feature.province_geometry.coordinates[0][0].forEach(...)
        feature.province_geometry.coordinates[0][0].forEach(
          ([lng, lat]: [number, number]) => {
            bounds[0] = Math.min(bounds[0], lng);
            bounds[1] = Math.min(bounds[1], lat);
            bounds[2] = Math.max(bounds[2], lng);
            bounds[3] = Math.max(bounds[3], lat);
          }
        );

        return {
          type: "Polygon",
          coordinates: feature.province_geometry.coordinates[0],
          ID: feature.province_id,
          view: bounds,
          areaType: SelectedType.Province,
          // If your back-end also provides a province_id for provinces, you can store it here
          // province_id: feature.province_id
        };
      });

      setProvinces(deckProvinceProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  /**
   * Loads each county geometry from the server
   */
  const loadCountiesGeometries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/countygeo");
      const jsonObject = await response.json();
      const geojsonData = jsonObject.data;

      const deckSoumProj = geojsonData.map((feature: any) => {
        const bounds = [Infinity, Infinity, -Infinity, -Infinity];

        feature.county_geometry.coordinates[0].forEach(
          ([lng, lat]: [number, number]) => {
            bounds[0] = Math.min(bounds[0], lng);
            bounds[1] = Math.min(bounds[1], lat);
            bounds[2] = Math.max(bounds[2], lng);
            bounds[3] = Math.max(bounds[3], lat);
          }
        );

        return {
          type: "Polygon",
          coordinates: feature.county_geometry.coordinates[0],
          ID: feature.county_id,
          view: bounds,
          areaType: SelectedType.County,
          // If your back-end includes a province_id, store it here:
          // province_id: feature.province_id
        };
      });

      setSoums(deckSoumProj);
    } catch (error) {
      console.error("Error fetching county data:", error);
    }
  };

  /**
   * Zoom utility
   * - Zoom to given bounds
   * - If no bounds, do nothing
   */
  const handleZoom = (bounds: [number, number, number, number] | null) => {
    if (map && bounds) {
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: selectedCounty ? 10 : selectedProvince ? 8 : 5.5,
        duration: 1500,
      });
    }
  };

  /**
   * Logic for clicking on polygons (province or county) or outside them
   */
  const handleMapClick = (
    view: [number, number, number, number] | null,
    ID: number | null,
    areaType: SelectedType | null
  ) => {
    // Province is clicked (only if no province is already selected):
    if (areaType === SelectedType.Province && !selectedProvince) {
      setSelectedProvince(ID);
      setSelectedCounty(null);
      if (view) handleZoom(view);

      return;
    }

    // County is clicked (only if a province is already selected)
    if (areaType === SelectedType.County && selectedProvince) {
      setSelectedCounty(ID);
      if (view) handleZoom(view);

      return;
    }

    // If we clicked outside any polygon:
    if (!areaType) {
      // Reset to entire country
      setSelectedProvince(null);
      setSelectedCounty(null);
      handleZoom(INITIAL_VIEW_BOUNDS);
    }
  };

  /**
   * On component mount or year changes, load everything
   */
  useEffect(() => {
    loadCountiesGeometries();
    loadProvinceGeometries();
    loadCarryingCapacityCells();
    loadZScoreCells();
    // If you had something like loadGrazingRangeCells(), call it here as well.
  }, [selectedYear]);

  /**
   * Build the Province layer
   * - Only clickable/pickable if no province is currently selected
   */
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
        handleMapClick(object.view, object.ID, object.areaType);
      } else if (!object) {
        // Click outside polygons
        handleMapClick(null, null, null);
      }
    },
  });

  /**
   * Build the County layer
   * - Data is only for the currently selected province (if any).
   * - Only clickable/pickable if a province is selected.
   */
  const soumLayer = new PolygonLayer({
    id: "soum-layer",
    data: selectedProvince
      ? soums.filter((s) => belongsToProvince(s, selectedProvince))
      : [],
    getPolygon: (d) => d.coordinates,
    getLineColor: [0, 0, 0, 70],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 0.8,
    pickable: !!selectedProvince,
    autoHighlight: !!selectedProvince,
    highlightColor: [255, 100, 100, 100],
    onClick: ({ object }) => {
      if (object && selectedProvince) {
        handleMapClick(object.view, object.ID, object.areaType);
      } else if (!object) {
        // Click outside polygons
        handleMapClick(null, null, null);
      }
    },
  });

  /**
   * Scatterplot layers for carrying capacity or z-score (points).
   * They remain globally pickable for demonstration (pickable: true).
   * If you want to disable these for certain states, you can similarly
   * adjust pickable based on selectedProvince or selectedCounty.
   */
  const cellsBelowLayer = new ScatterplotLayer({
    id: "cells-below-layer",
    data: !grazingRange
      ? belowCells
      : belowCells.filter((d) => d.grazing_range === grazingRange),
    getPosition: (d) => d.vertices,
    getRadius: 5000,
    getFillColor: [0, 170, 60, 200], // greenish
    pickable: true,
  });
  const cellsAtCapLayer = new ScatterplotLayer({
    id: "cells-atcap-layer",
    data: !grazingRange
      ? atCapCells
      : atCapCells.filter((d) => d.grazing_range === grazingRange),
    getPosition: (d) => d.vertices,
    getRadius: 5000,
    getFillColor: [255, 140, 90, 200], // orange
    pickable: true,
  });
  const cellsAboveLayer = new ScatterplotLayer({
    id: "cells-above-layer",
    data: !grazingRange
      ? aboveCells
      : aboveCells.filter((d) => d.grazing_range === grazingRange),
    getPosition: (d) => d.vertices,
    getRadius: 5000,
    getFillColor: [214, 15, 2, 150], // red
    pickable: true,
  });
  const cellsNegativeLayer = new ScatterplotLayer({
    id: "cells-negative-layer",
    data: !grazingRange
      ? negativeCells
      : negativeCells.filter((d) => d.grazing_range === grazingRange),
    getPosition: (d) => d.vertices,
    getRadius: 5000,
    getFillColor: [128, 0, 128, 200], // purple
    pickable: true,
  });
  const cellsZeroLayer = new ScatterplotLayer({
    id: "cells-zero-layer",
    data: !grazingRange
      ? zeroCells
      : zeroCells.filter((d) => d.grazing_range === grazingRange),
    getPosition: (d) => d.vertices,
    getRadius: 5000,
    getFillColor: [0, 0, 139, 200], // dark blue
    pickable: true,
  });
  const cellsPositiveLayer = new ScatterplotLayer({
    id: "cells-positive-layer",
    data: !grazingRange
      ? positiveCells
      : positiveCells.filter((d) => d.grazing_range === grazingRange),
    getPosition: (d) => d.vertices,
    getRadius: 5000,
    getFillColor: [0, 128, 128, 200], // teal
    pickable: true,
  });

  /**
   * Once the map is instantiated, store it in our state
   */
  const handleMapLoad = (event: maplibregl.MapLibreEvent) => {
    setMap(event.target as unknown as MapRef);
  };

  /**
   * Add the layers as a deck.gl Overlay whenever relevant state changes
   */
  useEffect(() => {
    if (!map) return;

    // Always include provinceLayer
    const layers = [provinceLayer];

    // Add soum layer only if a province is selected
    if (selectedProvince) {
      layers.push(soumLayer);
    }

    // Add whichever cell layers are active, based on selectedLayerType
    if (selectedLayerType === LayerType.ZScore) {
      if (showNegativeCells) layers.push(cellsNegativeLayer);
      if (showZeroCells) layers.push(cellsZeroLayer);
      if (showPositiveCells) layers.push(cellsPositiveLayer);
    } else if (selectedLayerType === LayerType.CarryingCapacity) {
      if (showBelowCells) layers.push(cellsBelowLayer);
      if (showAtCapCells) layers.push(cellsAtCapLayer);
      if (showAboveCells) layers.push(cellsAboveLayer);
    }

    const overlay = new MapboxOverlay({ layers });
    map.addControl(overlay);

    // Cleanup before re-render
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

  /**
   * If user wants to do something with the map once it's ready,
   * pass them the handleZoom function or similar
   */
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(handleZoom);
    }
  }, [map, onMapReady, soums]);

  /**
   * If still loading data, or no polygons are available, show a simple loading text
   */
  if (!provinces || provinces.length === 0 || !soums || soums.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        onLoad={handleMapLoad}
        // style={{ width: \"100vw\", height: \"100vh\" }} // If you want a full-screen map
        // onMove={(evt) => setViewState(evt.viewState)}  // If you want manual control
      >
        {/* Optional navigation control */}
        {/* <NavigationControl position=\"top-left\" /> */}
      </Map>
    </>
  );
};

export default MapComponent;
