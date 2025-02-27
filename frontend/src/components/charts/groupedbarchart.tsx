import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Props {
  datasets: { aimag: string; data: { x: string; y: number }[] }[];
  livestock: string[];
}

const GroupedBarChart: React.FC<Props> = ({ datasets, livestock }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const w = 500;
    const h = 500;
    const m = { top: 40, right: 30, bottom: 50, left: 60 };
        
    const d3svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${w + 100} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background-color", "#ffffff")


    //setting the scales of the graph
    const xScale = d3
      .scaleBand()
      .domain(datasets.map(d => d.aimag))
      .range([m.left, w - m.right])
      .padding(0.2);

    const xSubgroupScale = d3
      .scaleBand()
      .domain(livestock)
      .range([0, xScale.bandwidth()])
      .padding(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(datasets, d => d3.max(d.data, dataPoint => dataPoint.y)) || 0])
      .range([h - m.bottom, m.top]);

    const makeXGridlines = () => d3.axisBottom(xScale).ticks(5);
    const makeYGridlines = () => d3.axisLeft(yScale).ticks(5);


    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(livestock);

    d3svg.append("g")
      .attr("transform", `translate(0, ${h - m.bottom})`)
      .call(d3.axisBottom(xScale));

    d3svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .style("font-size", "14px")
      .text("Provinces");

    d3svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${h - m.bottom})`)
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
      .text("# of Livestock");

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
  
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(livestock);
    
    const groups = d3svg
    .selectAll(".group")
    .data(datasets)
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", d => `translate(${xScale(d.aimag)}, 0)`);


    groups.selectAll("rect")
      .data(d => d.data.map(dataPoint => ({ key: dataPoint.x, value: dataPoint.y })))
      .enter()
      .append("rect")
      .attr("x", d => xSubgroupScale(d.key)!)
      .attr("y", d => yScale(d.value))
      .attr("width", xSubgroupScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.value))
      .attr("fill", d => color(d.key));
   

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

    }, [datasets, livestock]);


  return (
    <div className="barchart" style={{ width: "100%", height: "100vh", maxHeight: "500px", maxWidth: "600px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GroupedBarChart;