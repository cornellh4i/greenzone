import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Prop {
  datasets: { aimag: string; data: { x: number; y: number }[] }[];
  livestock: string;
  dzudYears?: number[];
  privatizationPeriods?: number[];
}

const LineGraph: React.FC<Prop> = ({ datasets, livestock, dzudYears, privatizationPeriods  = [] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const w = 1500;  // Match container width
    const h = 600;   // Fixed height
    const m = { 
      top: 80, 
      right: 120,
      bottom: 60, 
      left: 120 
    };

    const allData = datasets.flatMap(d => d.data);

    const d3svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${w + m.right} ${h + m.top}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .style("background-color", "#ffffff");

    const yScaleLeft = d3
      .scaleLinear()
      .domain([0, d3.max(allData, d => d.y)! * 1.1])
      .range([h - m.bottom, m.top]);

    const yScaleRight = d3
      .scaleLinear()
      .domain([0, d3.max(allData, d => d.y)! / 5])
      .range([h - m.bottom, m.top]);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(allData, d => d.x)!, d3.max(allData, d => d.x)!])
      .range([m.left, w - m.right]);

    const colorScale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(datasets.map(d => d.aimag));

// === DZUD YEARS HIGHLIGHT ===
d3svg.selectAll(".dzud-rect")
  .data(dzudYears)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d - 0.5)) 
  .attr("y", m.top)
  .attr("width", d => xScale(d + 0.5) - xScale(d - 0.5))
  .attr("height", h - m.top - m.bottom)
  .style("fill", "rgba(124, 169, 253, 0.5)") // Light blue fill
  .style("pointer-events", "none"); // Prevent bars from blocking interactions



  // === PRIVATIZATION PERIOD HIGHLIGHT ===
  d3svg.selectAll(".privatization-rect")
  .data(privatizationPeriods)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d - 0.5))
  .attr("y", m.top)
  .attr("width", d => xScale(d + 0.5) - xScale(d - 0.5))
  .attr("height", h - m.top - m.bottom)
  .style("fill", "rgba(180, 180, 180, 0.5)") // Light gray fill
  .style("pointer-events", "none");



    // X Axis (Fix Year Formatting)
d3svg.append("g")
.attr("transform", `translate(0, ${h - m.bottom})`)
.call(d3.axisBottom(xScale).tickFormat(d3.format("d"))) // "d" removes commas
.selectAll("text")
.style("font-size", "14px")
.style("font-weight", "bold");


    d3svg.append("g")
      .attr("transform", `translate(${m.left}, 0)`)
      .call(d3.axisLeft(yScaleLeft))
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold");

    d3svg.append("g")
      .attr("transform", `translate(${w - m.right}, 0)`)
      .call(d3.axisRight(yScaleRight))
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold");

      d3svg.append("text")
  .attr("transform", "rotate(-90)") 
  .attr("x", -(h / 2))
  .attr("y", m.left / 2 - 20) 
  .attr("dy", "1em") 
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .style("fill", "#000")
  .style("text-anchor", "middle")
  .text("Primary Population");

    d3svg.append("text")
      .attr("transform", "rotate(90)")
      .attr("x", h / 2)
      .attr("y", -w + 60)
      .attr("dy", "-2.5em")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#000")
      .style("text-anchor", "middle")
      .text("Secondary Population");

    datasets.forEach(dataset => {
      const color = colorScale(dataset.aimag);
      const yScale = d3.max(dataset.data, d => d.y)! > 10000 ? yScaleLeft : yScaleRight;

      const lineGenerator = d3.line<{ x: number, y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      d3svg.append("path")
        .datum(dataset.data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", lineGenerator);

      d3svg.selectAll(`circle-${dataset.aimag}`)
        .data(dataset.data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", color)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    });

    // Legend at the Top
    const legend = d3svg.append("g")
      .attr("transform", `translate(${(w - datasets.length * 190) / 2}, 30)`); // Center the legend



    datasets.forEach((dataset, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(${i * 120}, 0)`);

      legendRow.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", colorScale(dataset.aimag));

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#000")
        .text(dataset.aimag.charAt(0).toUpperCase() + dataset.aimag.slice(1));
    });

    // Add Dzud Years to the Legend
    const dzudLegend = legend.append("g")
    .attr("transform", `translate(${(datasets.length + 1) * 120}, 0)`); // Offset to position it correctly

    dzudLegend.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", "rgba(124, 169, 253, 0.5)") // Light blue shading for legend
      .style("stroke", "#1E3A8A") // Border color
      .style("stroke-width", 2);

    dzudLegend.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#000")
      .text("Dzud Years");

      // === ADD PRIVATIZATION PERIOD TO LEGEND ===
const privLegend = legend.append("g")
.attr("transform", `translate(${(datasets.length + 2) * 120}, 0)`); // Offset to position it correctly

privLegend.append("rect")
.attr("width", 12)
.attr("height", 12)
.style("fill", "rgba(180, 180, 180, 0.6)") // Same color as the highlight
.style("stroke", "#8A8A8A") // Border color
.style("stroke-width", 2);

privLegend.append("text")
.attr("x", 20)
.attr("y", 12)
.style("font-size", "16px")
.style("font-weight", "bold")
.style("fill", "#000")
.text("Privatization Periods");


  }, [datasets, dzudYears]);

  

  return (
    <div className="line-graph" style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineGraph;
