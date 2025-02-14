import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  info: { x: number; y: number }[];
}

const LineGraph = ({ info }: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!info.length) return;
    //set the width and height of the svg canvas
    const w = 400; // These were hard-coded for demo purposes
    const h = 300; // SVG canvas size should adapt to size of dataset

    console.log(svgRef.current); // check out this component to see what it looks like

    const d3svg = d3
      .select(svgRef.current) // "grab" the svg canvas
      .attr("width", w)
      .attr("height", h)
      .style("background-color", "#d3d3d3")
      .style("border", "1px solid black");
    console.log(d3svg); // NOTE: the difference between svgRef.current and d3svg

    //setting the scales of the graph
    const xScale = d3
      .scaleLinear()
      .domain([0, 10]) // input -> data -> from 0 to maximum data value on the x axis
      .range([0, w]); // output -> pixels -> from 0 to size of our svg canvas
    const yScale = d3
      .scaleLinear()
      .domain([0, 10]) // input -> data -> from 0 to maximum data value on the y axis
      .range([h, 0]); // output -> pixels -> from 0 to size of our svg canvas
    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveCardinal);

    d3svg
      .append("path") // want to append the line path created by `lineGenerator`
      .datum(info)
      .attr("class", "line-path")
      .attr("d", lineGenerator(info)) // 'd' is an SVG.path attribute that is basically the "equation" for the path
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }, [info]);

  return (
    <div className="line-graph" style={{ width: "100%", height: "250px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineGraph;
