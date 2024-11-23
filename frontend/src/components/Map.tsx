import React, { useState, useEffect } from "react";
import { Map, MapRef } from "react-map-gl/maplibre";
import { FlyToInterpolator } from "@deck.gl/core";
import { PolygonLayer } from "deck.gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import * as d3Geo from "d3-geo";
import proj4 from "proj4";
import "maplibre-gl/dist/maplibre-gl.css";
import Button from "./atoms/Button";
import SidePanel from "@/components/organisms/SidePanel";

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

export interface Geometry {
  type: string;
  coordinates: number[][][] | number[][];
  provinceName: string | null;
  provinceLandArea: number | 0;
  provinceHerders: number | 0;
  view: [[number, number], [number, number]];
  livestock: {
    [key: string]: number | 0;
  };
  cattle: {
    [key: string]: number | 0;
  };
  goat: {
    [key: string]: number | 0;
  };
  sheep: {
    [key: string]: number | 0;
  };
  camel: {
    [key: string]: number | 0;
  };
  horse: {
    [key: string]: number | 0;
  };
}

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

// Define the projection transformation from EPSG:32646 (UTM Zone 46N) to WGS84
proj4.defs("EPSG:32646", "+proj=utm +zone=46 +datum=WGS84 +units=m +no_defs");

const MapComponent = () => {
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);
  const [belowHexagons, setBelowHexagons] = useState<Hexagon[]>([]);
  const [atCapHexagons, setAtCapHexagons] = useState<Hexagon[]>([]);
  const [aboveHexagons, setAboveHexagons] = useState<Hexagon[]>([]);
  const [country, setCountry] = useState<Geometry[]>([]);
  const [provinces, setProvinces] = useState<Geometry[]>([]);
  const [counties, setCounties] = useState<Geometry[]>([]);

  const [showHexagons, setShowHexagons] = useState(false);
  const [showProvinces, setShowProvinces] = useState(true);
  const [showCounties, setShowCounties] = useState(false);
  const [showBelowHexagons, setShowBelowHexagons] = useState(false);
  const [showAtCapHexagons, setShowAtCapHexagons] = useState(false);
  const [showAboveHexagons, setShowAboveHexagons] = useState(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [clickInfo, setClickInfo] = useState<string | null>(null);

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [map, setMap] = useState<MapRef | null>(null);

  const loadCountryData = async () => {
    const stateData = await import("@/components/charts/data/country.json");
    return stateData;
  };

  const loadProvinceData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/province");
      const json_object = await response.json();
      const geojsonData = json_object;

      const deckProvinceProj = geojsonData.map((feature: any) => {
        const utmCoordinates = feature.geometry.coordinates[0];
        const zoomCoordinates = (() => {
          let minLng = Infinity,
            minLat = Infinity,
            maxLng = -Infinity,
            maxLat = -Infinity;

          utmCoordinates.forEach(([lng, lat]) => {
            if (lng < minLng) minLng = lng;
            if (lat < minLat) minLat = lat;
            if (lng > maxLng) maxLng = lng;
            if (lat > maxLat) maxLat = lat;
          });
          console.log([
            [minLng, minLat],
            [maxLng, maxLat],
          ]);
          return [
            [minLng, minLat],
            [maxLng, maxLat],
          ];
        })();
        const provinceName = feature.province_name;
        const provinceLandArea = feature.province_land_area;
        const provinceHerders = feature.province_herders;
        const livestock = feature.province_number_of_livestock;
        const cattle = feature.province_number_of_cattle;
        const goat = feature.province_number_of_goat;
        const sheep = feature.province_number_of_sheep;
        const camel = feature.province_number_of_camel;
        const horse = feature.province_number_of_horse;

        return {
          type: "Polygon",
          coordinates: [utmCoordinates],
          provinceName: provinceName,
          provinceLandArea: provinceLandArea,
          provinceHerders: provinceHerders,
          view: zoomCoordinates,
          livestock: livestock,
          cattle: cattle,
          goat: goat,
          sheep: sheep,
          camel: camel,
          horse: horse,
        };
      });

      setProvinces(deckProvinceProj);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  const handleZoomToProvince = (
    zoomCoords: [[number, number], [number, number]]
  ) => {
    console.log("zoom:", zoomCoords);
    const sw = zoomCoords[0];
    console.log("sw:", sw);
    const ne = zoomCoords[1];
    console.log("ne:", ne);

    const centerLng = (sw[0] + ne[0]) / 2; // Average longitude
    const centerLat = (sw[1] + ne[1]) / 2;

    const lngDiff = ne[0] - sw[0];
    const latDiff = ne[1] - sw[1];

    const zoom = Math.floor(8 - Math.log2(Math.max(latDiff, lngDiff)));

    setViewState((prev) => ({
      ...prev,
      longitude: centerLng, // Center longitude & adjust to right to avoid sidepanel coverage
      latitude: centerLat, // Center latitude
      zoom: zoom, // Adjust zoom level as needed
      transitionDuration: 1000, // Smooth animation
      transitionInterpolator: new FlyToInterpolator({ curve: 1.5, speed: 1.2 }),
    }));
  };

  const loadCountyData = async () => {
    const countyData = await import("@/components/charts/data/counties.json");
    return countyData;
  };

  // EXMAMPLE FUNCTION TO FETCH HEX DATA
  const loadGeoData = async () => {
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
      setHexagons(deckHexProj);
      setBelowHexagons(deckHexProjBelow);
      setAtCapHexagons(deckHexProjAtCap);
      setAboveHexagons(deckHexProjAbove);
    } catch (error) {
      console.error("Error fetching data from Express:", error);
    }
  };

  useEffect(() => {
    loadGeoData();
    loadCountryData();
    loadProvinceData();

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

  const handleProvinceClick = ({
    object,
  }: {
    object: {
      provinceName: string;
      view: [[number, number], [number, number]];
    } | null;
  }) => {
    if (object) {
      setClickInfo(object.provinceName);
      handleZoomToProvince(object.view);
      setTimeout(() => {
        setClickInfo(null);
      }, 100);
    } else {
      setClickInfo(null);
    }
  };

  const handleClick = ({ object }) => {
    console.log("heuhwohw");
    setShowProvinces(true);
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
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: (d) => {
      if (d.bm_pred <= 0.4) {
        return [0, 170, 60, 200];
      } else if (d.bm_pred < 0.6) {
        return [255, 255, 20, 150];
      }
      return [214, 15, 2, 150];
    },
    lineWidthMinPixels: 1,
    updateTriggers: {
      getFillColor: hexagons.map((d) => d.bm_pred),
    },
  });

  const hexagonBelowLayer = new PolygonLayer({
    id: "hexagonBelow-layer",
    data: belowHexagons,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 170, 60, 200],
    // getFillColor: (d) => {
    //   if (d.bm_pred <= 0.4) {
    //     return [0, 170, 60, 200];
    //   }
    //   return [214, 15, 2, 150];
    // },
    lineWidthMinPixels: 1,
    updateTriggers: {
      getFillColor: belowHexagons.map((d) => d.bm_pred),
    },
  });

  const hexagonAtCapLayer = new PolygonLayer({
    id: "hexagonAtCap-layer",
    data: atCapHexagons,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [255, 255, 20, 150],
    lineWidthMinPixels: 1,
    updateTriggers: {
      getFillColor: atCapHexagons.map((d) => d.bm_pred),
    },
  });

  const hexagonAboveLayer = new PolygonLayer({
    id: "hexagon-above-layer",
    data: aboveHexagons,
    getPolygon: (d) => d.vertices,
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [214, 15, 2, 150],
    lineWidthMinPixels: 1,
    updateTriggers: {
      getFillColor: aboveHexagons.map((d) => d.bm_pred),
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
    // onHover: handleHover,
    onClick: handleClick,
    getLineWidth: 2,
    // updateTriggers: {
    //   getLineColor: hoverInfo ? [hoverInfo.feature] : [0, 0, 255],
    // },
    parameters: {
      blend: true,
    },
  });

  const provinceLayer: PolygonLayer = new PolygonLayer({
    id: "province-layer",
    data: provinces,
    getPolygon: (d) => d.coordinates[0],
    stroked: true,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 2,
    pickable: true,
    autoHighlight: true,
    highlightColor: [20, 20, 20, 20],
    onClick: handleProvinceClick,
    onHover: ({ object }) => {
      if (object) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    },
  });
  // console.log("Provinces data:", provinces);
  // console.log(clickInfo);

  const countyLayer = new PolygonLayer({
    id: "county-layer",
    data: counties,
    getPolygon: (d) => d.coordinates[0],
    stroked: true,
    filled: false,
    getLineColor: [0, 0, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    // onHover: handleHover,
    onClick: handleClick,
    getLineWidth: 2,
    // updateTriggers: {
    //   getLineColor: hoverInfo ? [hoverInfo.feature] : [0, 0, 255],
    // },
    parameters: {
      blend: true,
    },
  });
  // console.log("Counties data:", counties);

  const handleMapLoad = (event: mapboxgl.MapboxEvent) => {
    setMap(event.target as MapRef); // Store the map instance with correct type
  };

  useEffect(() => {
    if (!map) return; // Ensure map is loaded

    const layers = [];
    layers.push(countryLayer);
    layers.push(provinceLayer);
    if (showHexagons) layers.push(hexagonLayer);
    // if (showCounties) layers.push(countyLayer);
    if (showBelowHexagons) layers.push(hexagonBelowLayer);
    if (showAtCapHexagons) layers.push(hexagonAtCapLayer);
    if (showAboveHexagons) layers.push(hexagonAboveLayer);
    const overlay = new MapboxOverlay({ layers });

    // Clear any existing overlays and add the new one
    map.addControl(overlay);

    // Cleanup previous overlay
    return () => {
      map.removeControl(overlay);
    };
  }, [
    showHexagons,
    showBelowHexagons,
    showAtCapHexagons,
    showAboveHexagons,
    showProvinces,
    showCounties,
    map,
  ]);

  const zoomToProvince = (province: Geometry) => {
    const [sw, ne] = province.view; // Assuming `view` has the SW and NE bounds
    const centerLng = (sw[0] + ne[0]) / 2;
    const centerLat = (sw[1] + ne[1]) / 2;

    const lngDiff = ne[0] - sw[0];
    const latDiff = ne[1] - sw[1];

    const zoom = Math.floor(8 - Math.log2(Math.max(latDiff, lngDiff)));

    setViewState((prev) => ({
      ...prev,
      longitude: centerLng,
      latitude: centerLat,
      zoom,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ curve: 1.5, speed: 1.2 }),
    }));
  };

  const highlightProvince = (province: Geometry | null) => {
    if (!province) return;

    const updatedLayer = new PolygonLayer({
      ...provinceLayer.props, // Use existing properties
      getFillColor: (d) =>
        d.provinceName === province.provinceName
          ? [0, 0, 0, 200]
          : [0, 0, 0, 100],
    });

    // Replace the existing layer on the map
    const layers = [
      countryLayer,
      updatedLayer, // Updated province layer
      ...(showHexagons ? [hexagonLayer] : []),
      ...(showBelowHexagons ? [hexagonBelowLayer] : []),
      ...(showAtCapHexagons ? [hexagonAtCapLayer] : []),
      ...(showAboveHexagons ? [hexagonAboveLayer] : []),
    ];

    const overlay = new MapboxOverlay({ layers });
    map?.addControl(overlay);
  };

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <SidePanel
          data={provinces}
          provinceName={clickInfo}
          setShowHexagons={setShowHexagons}
          setShowBelowHexagons={setShowBelowHexagons}
          setShowAtCapHexagons={setShowAtCapHexagons}
          setShowAboveHexagons={setShowAboveHexagons}
          zoomToProvince={zoomToProvince}
          highlightProvince={highlightProvince}
        />

        {/* <Button
          label="Toggle Hexagons"
          onClick={() => setShowHexagons((prev) => !prev)}
        /> */}
        {/* <Button
          label="Toggle Counties"
          onClick={() => setShowCounties((prev) => !prev)}
        /> */}
      </div>
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        {...viewState}
        mapStyle={MAP_STYLE}
        cursor={isHovered ? "pointer" : "grab"}
        style={{ width: "100vw", height: "100vh" }}
        onLoad={handleMapLoad}
        onMove={(evt) => setViewState(evt.viewState)}
        interactiveLayerIds={["province-layer"]}
        controller={true}
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
