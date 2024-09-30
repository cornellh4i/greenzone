import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Props {
  datasets: { aimag: string; data: { x: number; y: number }[] }[];
  livestock: string;
}

const LineGraph: React.FC<Props> = ({ datasets, livestock }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const w = 500;
    const h = 500;
    const m = { top: 40, right: 30, bottom: 50, left: 60 };

    const allData = datasets.flatMap(d => d.data);

        
    const d3svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${w + 100} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background-color", "#ffffff")


    //setting the scales of the graph
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(allData, d => d.x)!, d3.max(allData, d => d.x)!])
      .range([m.left, w - m.right]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(allData, d => d.y)!, d3.max(allData, d => d.y)!])
      .range([h - m.bottom, m.top]);

    const makeXGridlines = () => d3.axisBottom(xScale).ticks(5);
    const makeYGridlines = () => d3.axisLeft(yScale).ticks(5);


    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(datasets.map(d => d.aimag));

    d3svg.append("g")
      .attr("transform", `translate(0, ${h - m.bottom})`)
      .call(d3.axisBottom(xScale))

    d3svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .style("font-size", "14px")
      .text("Year");

    d3svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${h - m.bottom})`)
      .call(
        makeXGridlines()
          .tickSize(-h + m.top + m.bottom)
          .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("stroke", "#e0e0e0")
      .style("stroke-opacity", "0.3");
      

    d3svg.append("g")
      .attr("transform", `translate(${m.left}, 0)`)
      .call(d3.axisLeft(yScale));

    d3svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -h / 2)
      .attr("y", 20)
      .style("font-size", "14px")
      .text(livestock);

    d3svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${m.left},0)`)
      .call(
        makeYGridlines()
          .tickSize(-w + m.left + m.right)
          .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("stroke", "#e0e0e0")
      .style("stroke-opacity", "0.3");
  
    datasets.forEach(dataset => {
      const color = colorScale(dataset.aimag);
    
      d3svg
        .selectAll(`circle-${dataset.aimag}`)
        .data(dataset.data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 4)
        .attr("fill", color);

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
        .attr("d", lineGenerator); // Comment out for scatter plot
      });

    const legend = d3svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${w}, ${m.top})`);

    colorScale.domain().forEach((aimag, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
    
      legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", colorScale(aimag));
    
      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text(aimag);
    });

    }, [datasets]);


  return (
    <div className="line-graph" style={{ width: "100%", height: "100vh", maxHeight: "500px", maxWidth: "600px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineGraph;