import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Props {
  datasets: { aimag: string; data: { x: string; y: number }[] }[];
  livestock: string[];
  orientation: boolean; //true - vertical, false - horizontal
}

const BarChart: React.FC<Props> = ({ datasets, livestock, orientation}) => {
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
    const xScaleVert = d3
      .scaleBand()
      .domain(livestock)  // Livestock types as x-axis labels
      .range([m.left, w -m.right])
      .padding(0.2) ;

    // yScale based on total livestock counts
    const yScaleVert = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d.totalLivestockCount) || 0])
      .range([h - m.bottom, m.top]);

    // yScale based on livestock types
    const yScaleHorizontal = d3
      .scaleBand()
      .domain(livestock)  // Livestock types as x-axis labels
      .range([m.top, h-m.bottom])
      .padding(0.2) ;

    // xScale based on total livestock counts
    const xScaleHorizontal = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d.totalLivestockCount) || 0])
      .range([m.left, w - m.right]);

    // // Gridlines
    // const makeYGridlines = () => {return orientation ? d3.axisLeft(yScaleVert).ticks(5) : d3.axisBottom(xScaleHorizontal).ticks(5)};

    // Draw x-axis
    d3svg.append("g")
      .attr("transform", `translate(0, ${h - m.bottom})`)
      .call(orientation ? d3.axisBottom(xScaleVert): d3.axisBottom(xScaleHorizontal));

    //Add x-axis label
    d3svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .style("font-size", "14px")
      .text(orientation ? "Types of Livestock" : "# of Livestock");

    // Draw y-axis
    d3svg.append("g")
      .attr("transform", `translate(${m.left}, 0)`)
      .call(orientation ? d3.axisLeft(yScaleVert) : d3.axisLeft(yScaleHorizontal));

    // Add y-axis label
    d3svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -h / 2)
      .attr("y", 20)
      .style("font-size", "14px")
      .text(orientation ? "# of Livestock" :  "Types of Livestock");

    // // Add gridlines
    // d3svg
    //   .append("g")
    //   .attr("class", "grid")
    //   .attr("transform", orientation ? `translate(${m.left}, 0)` : `translate(0, ${h-m.bottom})`)
    //   .call(
    //     makeYGridlines()
    //       .tickSize(orientation ? -w + m.left + m.right : -h + m.top + m.bottom)
    //       .tickFormat(() => "")
    //   )
    //   .style("stroke-dasharray", "3,3")
    //   .style("stroke", "#e0e0e0")
    //   .style("stroke-opacity", "0.3");

    // Draw bars
    d3svg.selectAll(".bar")
      .data(aggregatedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => orientation ? xScaleVert(d.livestockType)! :  m.left)
      .attr("y", d => orientation ? yScaleVert(d.totalLivestockCount) : yScaleHorizontal(d.livestockType)!)
      .attr("width", orientation ? xScaleVert.bandwidth() :  d => xScaleHorizontal(d.totalLivestockCount) - xScaleHorizontal(0))
      .attr("height", orientation ? d => yScaleVert(0) - yScaleVert(d.totalLivestockCount) : yScaleHorizontal.bandwidth())
      .attr("fill", "#205142");

    d3svg.selectAll(".label")
      .data(aggregatedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x",d => orientation ? xScaleVert(d.livestockType)! + xScaleVert.bandwidth() / 2 : xScaleHorizontal(d.totalLivestockCount)! + 40)
      .attr("y", d => orientation 
        ? yScaleVert(d.totalLivestockCount) - 5 : yScaleHorizontal(d.livestockType)! + yScaleHorizontal.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(d=> Math.floor(d.totalLivestockCount));

  }, [datasets, livestock, orientation]);

  return (
    <div className="barchart" style={{ width: "100%", height: "100vh", maxHeight: "500px", maxWidth: "600px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
