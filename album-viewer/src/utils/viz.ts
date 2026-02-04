// generate a plot with D3.js of the selling price of the album by year
// x-axis are the month series and y-axis show the numbers of albums sold
// data from the sales of album are loaded in from an external source and are in json format

import * as d3 from "d3";

interface SalesData {
  month: string; // e.g., "January", "February", etc.
  year: number;
  albumsSold: number;
}

export function generateSalesPlot(
  data: SalesData[],
  containerId: string,
): void {
  // Set dimensions and margins for the plot
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create x scale (months)
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, width])
    .padding(0.1);

  // Create y scale (albums sold)
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.albumsSold) || 0])
    .nice()
    .range([height, 0]);

  // Add x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y-axis
  svg.append("g").call(d3.axisLeft(yScale));

  // Add x-axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .style("text-anchor", "middle")
    .text("Month");

  // Add y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .style("text-anchor", "middle")
    .text("Albums Sold");

  // Create bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.month) || 0)
    .attr("y", (d) => yScale(d.albumsSold))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.albumsSold))
    .attr("fill", "steelblue")
    .on("mouseover", function () {
      d3.select(this).attr("fill", "orange");
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", "steelblue");
    });

  // Add value labels on top of bars
  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => (xScale(d.month) || 0) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.albumsSold) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.albumsSold)
    .style("font-size", "12px");
}
