import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Props {
  datasets: { aimag: string; data: { x: string; y: number }[] }[];
  livestock: string[];
}

const BarChart: React.FC<Props> = ({ datasets, livestock }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const w = 500;
    const h = 500;
    const m = { top: 40, right: 30, bottom: 50, left: 60 };

    const aggregatedData = livestock.map(livestockType => {
      const totalLivestockCount = datasets.reduce((total, dataset) => {
        if (Array.isArray(dataset.data)) {
          const livestockEntry = dataset.data.find(d => d.x === livestockType);
          return total + (livestockEntry ? livestockEntry.y : 0);
        }
        return total;
      }, 0);
    
      return { livestockType, totalLivestockCount };
    });

    const d3svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${w + 100} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background-color", "#ffffff");

    // xScale based on livestock types
    const xScale = d3
      .scaleBand()
      .domain(livestock)  // Livestock types as x-axis labels
      .range([m.left, w - m.right])
      .padding(0.2);

    // yScale based on total livestock counts
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d.totalLivestockCount) || 0])
      .range([h - m.bottom, m.top]);

    // Gridlines
    const makeYGridlines = () => d3.axisLeft(yScale).ticks(5);

    // Draw x-axis
    d3svg.append("g")
      .attr("transform", `translate(0, ${h - m.bottom})`)
      .call(d3.axisBottom(xScale));

    // Add x-axis label
    d3svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .style("font-size", "14px")
      .text("Types of Livesstock");

    // Draw y-axis
    d3svg.append("g")
      .attr("transform", `translate(${m.left}, 0)`)
      .call(d3.axisLeft(yScale));

    // Add y-axis label
    d3svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -h / 2)
      .attr("y", 20)
      .style("font-size", "14px")
      .text("# of Livestock");

    // Add gridlines
    d3svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${m.left}, 0)`)
      .call(
        makeYGridlines()
          .tickSize(-w + m.left + m.right)
          .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("stroke", "#e0e0e0")
      .style("stroke-opacity", "0.3");

    // Draw bars
    d3svg.selectAll(".bar")
      .data(aggregatedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.livestockType)!)
      .attr("y", d => yScale(d.totalLivestockCount))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.totalLivestockCount))
      .attr("fill", "#69b3a2");

  }, [datasets, livestock]);

  return (
    <div className="barchart" style={{ width: "100%", height: "100vh", maxHeight: "500px", maxWidth: "600px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
