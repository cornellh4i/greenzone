import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface Props {
  datasets: { aimag: string; data: { x: string; y: number }[] }[];
  livestock: string[];
  orientation: boolean; //true - vertical, false - horizontal
}



const BarChart: React.FC<Props> = ({ datasets, livestock, orientation }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const w = 500;
    const h = 500;
    const m = { top: 40, right: 30, bottom: 50, left: 120 };

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
      .range([m.left, w - m.right])
      .padding(0.2);

    // yScale based on total livestock counts
    const yScaleVert = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d.totalLivestockCount) || 0])
      .range([h - m.bottom, m.top]);

    // yScale based on livestock types
    const yScaleHorizontal = d3
      .scaleBand()
      .domain(livestock)  // Livestock types as x-axis labels
      .range([m.top, h - m.bottom])
      .padding(0.2);

    // xScale based on total livestock counts
    const xScaleHorizontal = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d.totalLivestockCount) || 0])
      .range([m.left, w - m.right]);

    const totalLivestockCount = aggregatedData.reduce((total, item) => {
      return total + item.totalLivestockCount;
    }, 0);

    // // Gridlines
    // const makeYGridlines = () => {return orientation ? d3.axisLeft(yScaleVert).ticks(5) : d3.axisBottom(xScaleHorizontal).ticks(5)};

    // Draw x-axis
    /*
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
*/



    d3svg
      .append("text")
      .attr("class", "total-livestock-count")
      .attr("text-anchor", "start")
      .attr("x", 60)
      .attr("y", -20)
      .style("font-size", "30px")
      .style("font-weight", "bold")
      .text(`Total: ${Math.floor(totalLivestockCount)} livestock`);

    d3svg
      .append("g")
      .attr("transform", `translate(16, -48)`) // Position it to the left of the text
      .html(function () {
        return `<svg width="35" height="35" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_7780_29701)">
        <path d="M5.12109 10.8904V12.3904V19.8904C5.12109 20.7201 5.79141 21.3904 6.62109 21.3904H8.12109C8.95078 21.3904 9.62109 20.7201 9.62109 19.8904V15.756C10.0852 16.0654 10.5867 16.3185 11.1211 16.5107V17.6451C11.1211 18.0576 11.4586 18.3951 11.8711 18.3951C12.2836 18.3951 12.6211 18.0576 12.6211 17.6451V16.8529C12.8695 16.881 13.118 16.8951 13.3711 16.8951C13.6242 16.8951 13.8727 16.881 14.1211 16.8529V17.6451C14.1211 18.0576 14.4586 18.3951 14.8711 18.3951C15.2836 18.3951 15.6211 18.0576 15.6211 17.6451V16.5107C16.1555 16.3232 16.657 16.0701 17.1211 15.756V19.8904C17.1211 20.7201 17.7914 21.3904 18.6211 21.3904H20.1211C20.9508 21.3904 21.6211 20.7201 21.6211 19.8904V12.3904L23.1211 13.8904V16.2107C23.1211 16.656 23.2523 17.0873 23.5008 17.4576L25.4648 20.406C25.8773 21.0201 26.5664 21.3904 27.307 21.3904C28.3617 21.3904 29.2711 20.6451 29.4773 19.6091L30.4289 14.8466C30.5508 14.2373 30.4148 13.6044 30.0539 13.0982L29.8711 12.8404V9.01538C29.8711 8.39194 29.3695 7.89038 28.7461 7.89038C28.1227 7.89038 27.6211 8.39194 27.6211 9.01538V9.69038L25.1414 6.21694C23.8711 4.44507 21.8273 3.39038 19.6477 3.39038H13.3711H12.6211H9.62109H7.37109C4.26328 3.39038 1.74609 5.90757 1.74609 9.01538V11.5466C1.06172 12.0998 0.621094 12.9435 0.621094 13.8904V14.7154C0.621094 15.0904 0.921094 15.3904 1.29609 15.3904C2.78672 15.3904 3.99609 14.181 3.99609 12.6904V12.3904V10.8904V9.01538C3.99609 7.87632 4.56328 6.86851 5.42578 6.25444C5.22891 6.76069 5.12109 7.31382 5.12109 7.89038V10.8904ZM26.8711 16.1404C26.8711 15.9415 26.9501 15.7507 27.0908 15.6101C27.2314 15.4694 27.4222 15.3904 27.6211 15.3904C27.82 15.3904 28.0108 15.4694 28.1514 15.6101C28.2921 15.7507 28.3711 15.9415 28.3711 16.1404C28.3711 16.3393 28.2921 16.5301 28.1514 16.6707C28.0108 16.8114 27.82 16.8904 27.6211 16.8904C27.4222 16.8904 27.2314 16.8114 27.0908 16.6707C26.9501 16.5301 26.8711 16.3393 26.8711 16.1404ZM8.43047 8.19976C8.23359 8.00288 8.12109 7.73101 8.12109 7.44976C8.12109 6.86382 8.59453 6.39038 9.18047 6.39038H17.557C18.143 6.39038 18.6164 6.86382 18.6164 7.44976C18.6164 7.73101 18.5039 8.00288 18.307 8.19976L17.2102 9.29663C16.193 10.3185 14.8102 10.8904 13.3711 10.8904C11.932 10.8904 10.5492 10.3185 9.53203 9.30132L8.43516 8.20444L8.43047 8.19976Z" fill="black"/>
        </g>
        <defs>
        <clipPath id="clip0_7780_29701">
        <rect width="30" height="24" fill="white" transform="translate(0.621094 0.391113)"/>
        </clipPath>
        </defs>
        </svg>        
        `;
      });

    // Draw y-axis
    d3svg.append("g")
      .attr("transform", `translate(${m.left}, 0)`)
      .call(orientation ? d3.axisLeft(yScaleVert) : d3.axisLeft(yScaleHorizontal))
      .selectAll("text")  // Select all the text elements in the y-axis
      .style("font-size", "25px")  // Significantly increased font size for the livestock labels
      .style("font-weight", "bold")  // Make the text bold for better visibility
    //.attr("dx", "-0.5em");

    // Add y-axis label
    d3svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -h / 2)
      .attr("y", 20)
      .style("font-size", "14px")
    //.text(orientation ? "# of Livestock" : "Types of Livestock");

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
      .attr("x", d => orientation ? xScaleVert(d.livestockType)! : m.left)
      .attr("y", d => orientation ? yScaleVert(d.totalLivestockCount) : yScaleHorizontal(d.livestockType)!)
      .attr("width", orientation ? xScaleVert.bandwidth() : d => xScaleHorizontal(d.totalLivestockCount) - xScaleHorizontal(0))
      .attr("height", orientation ? d => yScaleVert(0) - yScaleVert(d.totalLivestockCount) : yScaleHorizontal.bandwidth())
      .attr("fill", "#205142");


    d3svg.selectAll(".label")
      .data(aggregatedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => orientation ? xScaleVert(d.livestockType)! + xScaleVert.bandwidth() / 2 : xScaleHorizontal(d.totalLivestockCount)! + 40)
      .attr("y", d => orientation
        ? yScaleVert(d.totalLivestockCount) - 5 : yScaleHorizontal(d.livestockType)! + yScaleHorizontal.bandwidth() / 2)
      .style("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(d => Math.floor(d.totalLivestockCount));

  }, [datasets, livestock, orientation]);

  return (
    <div className="barchart" style={{ width: "100%", height: "100vh", maxHeight: "500px", maxWidth: "600px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
