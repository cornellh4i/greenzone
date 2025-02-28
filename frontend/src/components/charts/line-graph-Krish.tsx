import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

  interface Props {
    info: { x: number; y: number }[];
  }
  
  // create LineGraph 
  const LineGraph = ({ info }: Props) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    useEffect(() => {
        if (!info.length) return; 
        const w = 400;
        const h = 300;
        console.log(svgRef.current); 
        
        const d3svg = d3
            .select(svgRef.current)
            .attr("width", w)
            .attr("height", h)
            .attr("background-color", "#d3d3d3")
            .attr("border", "1px solid black")
        console.log(d3svg);

        const xScale = d3.scaleLinear()
            .domain([0, 10]) 
            .range([0, w]);
        
        const yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([h, 0]); 
        
        const lineGenerator = d3.line <{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3.curveCardinal);
        
        d3svg
            .append("path")
            .datum(info)
            .attr("class", "line-path")
            .attr("d", lineGenerator(info))
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

    }, [info]); 
    return (
        <div className="line-graph" style={{ width: "100%", height: "250px" }}>
        <svg ref={svgRef}></svg>
        </div>
    );
}
  
  // export 
  export default LineGraph;