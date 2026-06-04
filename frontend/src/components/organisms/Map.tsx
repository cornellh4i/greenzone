import { Map, MapRef } from "react-map-gl/maplibre";
import React, { useContext, useState, useEffect } from "react";
import { PolygonLayer, ScatterplotLayer, TextLayer } from "deck.gl";
import { Box, CircularProgress } from "@mui/material";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Context, LayerType, SelectedType } from "../../utils/global";
import { backendUrl } from "../../utils/const";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const INITIAL_VIEW_STATE = {
  latitude: 46.8625,
  longitude: 103.8467,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
};
const MONGOLIAN_CHARSET = [
  ...new Set(
    "АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмноөпрстуүфхцчшщъыьэюяТөв",
  ),
];
const ascii = Array.from({ length: 0x7f }, (_, i) => String.fromCharCode(i));
const fullCharSet = [...ascii, ...MONGOLIAN_CHARSET];
const COORDS = {
  Dornod: [114.0, 49.0],
  "Bayan-Ulgii": [89.5, 48.4],
  Khovd: [92.28920904924195, 46.90155627028161],
  "Govi-Altai": [95.94668263630372, 45.3440149923263],
  Bayankhongor: [99.0, 45.5],
  Umnugovi: [104.12157512386474, 43.28572876143857],
  Khuvsgul: [99.91207850156681, 50.23493380367856],
  Selenge: [106.2244648324372, 49.4760827498768],
  Tuv: [106.5664145642356, 47.67749923323126],
  Orkhon: [104.29827665582003, 49.04440025267898],
  Ulaanbaatar: [107.16542432218421, 47.91553020443232],
  "Darkhan-Uul": [106.0, 49.5],
  Sukhbaatar: [113.54263601561543, 46.22267225866883],
  Dornogovi: [112.5, 43.5],
  Bulgan: [103.5, 48.8],
  Uvs: [92.94033127030316, 49.633371610066945],
  Zavkhan: [96.4451815533453, 48.29736177525989],
  Khentii: [110.44557516794877, 47.89003229894901],
  Govisumber: [108.56856126775833, 46.46869639208894],
  Arkhangai: [101.5, 47.5],
  Dundgovi: [106.5, 45.5],
  Uvurkhangai: [102.71288177410669, 45.83790962831799],
};

// For the Geometrical Shapes on the Maps like Province And Counties
interface Geometry {
  view: [number, number, number, number] | null;
  type: string;
  ID: number;
  name: string;
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
// const INITIAL_VIEW_BOUNDS: [number, number, number, number] = [87, 41, 119, 52];
// const MAP_STYLE =
//   "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const MAP_STYLE = "https://demotiles.maplibre.org/style.json";

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
  const [mapLink, setMapLink] = useState<string | null>(null);
  const [loadingCells, setLoadingCells] = useState(false);

  const [lang, setLang] = useState<string>("en");
  const toggleLanguage = () => {
    const newLang = lang == "en" ? "mn" : "en";
    i18n.changeLanguage(i18n.language === "en" ? "mn" : "en");
    setLang(newLang);
  };
  const { t: tp } = useTranslation("mapprovince");
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

    showAboveCells,
    showBelowCells,
    showAtCapCells,

    showPositiveCells,
    showNegativeCells,
    showZeroCells,
    selectedLayerType,

    selectedYear,
  } = context;

  const fetchMapStyle = async () => {
    const res = await fetch(`${backendUrl}/maps`);

    const { data } = await res.json();
    console.log("got the map", data);
    if (data) {
      setMapLink(data);
    } else {
      console.error("Failed to fetch map style data");
    }
  };
  useEffect(() => {
    fetchMapStyle();
  }, []);
  const loadCarryingCapacityCells = async () => {
    try {
      const below_response = await fetch(
        `${backendUrl}/cells/${selectedYear}/carrying_capacity/0/0.4`,
      );
      const at_cap_response = await fetch(
        `${backendUrl}/cells/${selectedYear}/carrying_capacity/0.4/0.6`,
      );
      const above_response = await fetch(
        `${backendUrl}/cells/${selectedYear}/carrying_capacity/0.6/1`,
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
        })),
      );
      setAtCapCells(
        json_at_cap_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
        })),
      );
      setAboveCells(
        json_above_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
        })),
      );
    } catch (error) {
      console.error("Error fetching data from Express:", error);
    }
  };

  const loadZScoreCells = async () => {
    try {
      const negative_response = await fetch(
        `${backendUrl}/cells/${selectedYear}/z_score/0/0.4`,
      );
      const zero_response = await fetch(
        `${backendUrl}/cells/${selectedYear}/z_score/0.4/0.6`,
      );
      const positive_response = await fetch(
        `${backendUrl}/cells/${selectedYear}/z_score/0.6/1`,
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
        })),
      );
      setZeroCells(
        json_zero_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
        })),
      );
      setPositiveCells(
        json_positive_response.data.map((feature: any) => ({
          vertices: feature.wkb_geometry.coordinates,
          z_score: feature.z_score,
          // Removed grazing_range property
        })),
      );
    } catch (error) {
      console.error("Error fetching z-score data:", error);
    }
  };

  const loadProvinceGeometries = async () => {
    try {
      const response = await fetch(`${backendUrl}/provincegeo`);
      const provViews: ProvinceView = {};
      const json_object = await response.json();
      const geojsonData = json_object.data;
      const deckProvinceProj = geojsonData.map((feature: any) => {
        type Bounds = [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]

        const ring: [number, number][] = feature.wkb_geometry.coordinates[0][0];

        const [minLng, minLat, maxLng, maxLat]: Bounds = ring.reduce(
          ([minX, minY, maxX, maxY], [lng, lat]) => [
            Math.min(minX, lng),
            Math.min(minY, lat),
            Math.max(maxX, lng),
            Math.max(maxY, lat),
          ],
          [Infinity, Infinity, -Infinity, -Infinity] as Bounds,
        );
        const bounds: Bounds = [minLng, minLat, maxLng, maxLat];
        provViews[feature.id] = bounds;
        return {
          type: "Polygon",
          name: feature.name,
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
      const response = await fetch(`${backendUrl}/county/geom/${province_id}`);
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
          },
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
      map.flyTo({
        center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
        zoom: 6,
        duration: 1000,
        essential: true,
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
    setLoadingCells(true);
    const loaders: Promise<any>[] = [];
    loaders.push(loadProvinceGeometries());
    if (selectedLayerType == LayerType.CarryingCapacity) {
      loaders.push(loadCarryingCapacityCells());
    } else if (selectedLayerType == LayerType.ZScore) {
      loaders.push(loadZScoreCells());
    }
    Promise.all(loaders)
      .catch((err) => console.log(err))
      .finally(() => {
        setLoadingCells(false);
      });
  }, [selectedYear, selectedLayerType]);

  const labelLayer = new TextLayer({
    id: `TextLayer-${i18n.language}`,
    data: provinces,
    getPosition: (d) =>
      COORDS[d.name as keyof typeof COORDS] as [number, number],
    getText: (d) => tp(d.name),
    getAlignmentBaseline: "center",
    getColor: [130, 120, 130, 180],
    getSize: 10,
    getTextAnchor: "middle",
    pickable: true,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    characterSet: fullCharSet,
  });

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

  const countyHighlightLayer = new PolygonLayer({
    id: "county-highlight-layer",
    data: soums.filter((soum) => soum.ID === selectedCounty),
    getPolygon: (d) => d.coordinates,
    filled: true,
    getLineColor: [0, 0, 0],
    getFillColor: [255, 100, 100, 100],
    lineWidthMinPixels: 1,
    pickable: false,
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
    getFillColor: [0, 170, 60, 160],
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
      if (selectedCounty) {
        layers.push(countyHighlightLayer);
      }
    }
    layers.push(labelLayer);

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
    labelLayer,
    selectedYear,
    selectedLayerType,
    belowCells,
    atCapCells,
    aboveCells,
    negativeCells,
    zeroCells,
    positiveCells,
  ]);

  if (!provinces || provinces.length === 0 || !mapLink) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={mapLink ?? MAP_STYLE}
        onLoad={handleMapLoad}
        style={{ width: "100%", height: "100%" }}
      />
      {loadingCells && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 999, // above the map
          display: "inline-flex",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: "background.paper", // ensure contrast
        }}
      >
        <Box
          onClick={() => toggleLanguage()}
          sx={{
            p: 1,
            cursor: "pointer",
            bgcolor: lang === "en" ? "success.main" : "background.paper",
            color: lang === "en" ? "success.contrastText" : "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <img src="/flags_en.png" width={20} alt="EN" />
          EN
        </Box>
        <Box
          onClick={() => toggleLanguage()}
          sx={{
            p: 1,
            cursor: "pointer",
            bgcolor: lang === "mn" ? "success.main" : "background.paper",
            color: lang === "mn" ? "success.contrastText" : "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <img src="/flags_mn.png" width={20} alt="MN" />
          MN
        </Box>
      </Box>
    </Box>
  );
};

export default MapComponent;
