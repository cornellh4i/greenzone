import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Props {
  datasets: { aimag: string; data: { x: number; y: number }[] }[];
}

const LineGraph: React.FC<Props> = ({ datasets }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const w = 500;
    const h = 500;
    const m = { top: 20, right: 30, bottom: 30, left: 40 };

    const allData = datasets.flatMap(d => d.data);

    
    console.log(svgRef.current);
    
    const d3svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("background-color", "#ffffff")
      .style("border", "1px solid black");


    //setting the scales of the graph
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(allData, d => d.x)!, d3.max(allData, d => d.x)!])
      .range([m.left, w - m.right]);
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(allData, d => d.y)!, d3.max(allData, d => d.y)!])
      .range([h - m.bottom, m.top]);

    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveCardinal);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(datasets.map(d => d.aimag));

    d3svg.append("g")
      .attr("transform", `translate(0, ${h - m.bottom})`)
      .call(d3.axisBottom(xScale));

    d3svg.append("g")
      .attr("transform", `translate(${m.left}, 0)`)
      .call(d3.axisLeft(yScale));

      datasets.forEach(dataset => {
        const lineGenerator = d3.line<{ x: number, y: number }>()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))
          .curve(d3.curveMonotoneX);

        d3svg
          .append("path")
          .datum(dataset.data)
          .attr("fill", "none")
          .attr("stroke", colorScale(dataset.aimag))
          .attr("stroke-width", 2)
          .attr("d", lineGenerator);
        });  
      }, [datasets]);


  return (
    <div className="line-graph" style={{ width: "100%", height: "250px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineGraph;