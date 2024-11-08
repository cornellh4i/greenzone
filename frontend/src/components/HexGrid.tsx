// hexGrid.tsx
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import * as d3Geo from "d3-geo";


const HexGrid = () => {
  const [hexagons, setHexagons] = useState([]);

  useEffect(() => {
    try{
      const response = await fetch('http://localhost:8080/api/hexagons') 
      let json_object = await response.json()
      console.log(json_object.message)

    }catch (error){
      console.error('Error fetching data from Express:', error);
    }
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/us_states_hexgrid.geojson.json"
    ).then((geojsonData) => {
      console.log("sjv jh hjb vhjerbhjvhw")
      const geoDarta = geojsonData as GeoJSON.FeatureCollection;
      const projection = d3Geo.geoMercator();

      const deckHexProj = (
        geojsonData as GeoJSON.FeatureCollection
      ).features.map((feature) => {

        const polygon = feature.geometry as GeoJSON.Polygon;

        const projectedPolygon = polygon.coordinates[0].map((coord) => {
          // Project each coordinate and ensure it's of the correct format
          const projected = projection(coord as [number, number]);
          return projected ? projected : [0, 0]; // Fallback if projection returns null
        });

          // Only invert if projection and invert are defined
          const invertedPolygon = projectedPolygon.map((coord) => {
            if (projection && projection.invert) {
              const inverted = projection.invert(coord as [number, number]);
              return inverted ? inverted : [0, 0];
            }
            return [0, 0];
          });

          return { vertices: invertedPolygon };
        });
      });
      setHexagons(deckHexProj);
    });
  }, []);

  return <div>{/* Rendered within MapComponent */}</div>;
};

export default HexGrid;
