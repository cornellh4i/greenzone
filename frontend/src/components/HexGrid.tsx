import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import * as d3Geo from "d3-geo";
import { GeoJSON, FeatureCollection } from "geojson";

type Params = {
  geoData: GeoJSON.GeoJSON;
  width: number;
  height: number;
  radius: number;
  // xCenter: number;
  // yCenter: number;
};

const HexbinGrid = ({
  geoData,
  width,
  height,
  radius,
}: // xCenter,
// yCenter,
Params) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // cast it as a feature collection
  geoData = geoData as FeatureCollection;

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Set up projection to match your GeoJSON coordinate system (UTM Zone 46N here)
    const projection = d3Geo
      .geoTransverseMercator()
      .center([0, 0]) // Adjust as needed for your data's region
      .scale(1)
      .translate([0, 0]);

    const path = d3Geo.geoPath().projection(projection);

    // Calculate bounds and scale for fitting the data within SVG
    const bounds = path.bounds(geoData);
    const scale =
      1.95 /
      Math.max(
        (bounds[1][0] - bounds[0][0]) / width,
        (bounds[1][1] - bounds[0][1]) / height
      );
    const translate: [number, number] = [
      (width - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (height - scale * (bounds[1][1] + bounds[0][1])) / 2,
    ];

    projection.scale(scale).translate(translate);

    // Convert GeoJSON to points using centroids of each feature
    const points: [number, number][] = geoData.features.map((feature) => {
      const [x, y] = path.centroid(feature);
      return [x, y];
    });

    // Hexbin setup
    const hexbinGenerator = hexbin()
      .radius(radius)
      .extent([
        [0, 0],
        [width, height],
      ]);

    const hexData = hexbinGenerator(points);

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      // d3.max can be undefined (ex: no points) so we need 1 to make sure that the function will still be valid
      .domain([0, d3.max(hexData, (d) => d.length) || 1]);

    // Draw hexagons
    svg
      .append("g")
      .selectAll("path")
      .data(hexData)
      .enter()
      .append("path")
      .attr("d", hexbinGenerator.hexagon())
      .attr("transform", (d) => `translate(${d.x - 20}, ${d.x - 20})`)
      .attr("fill", (d) => colorScale(d.length))
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5);
  }, [geoData, width, height, radius]);

  return <svg ref={svgRef} />;
};

export default HexbinGrid;