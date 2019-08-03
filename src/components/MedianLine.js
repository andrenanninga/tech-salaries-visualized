import React from "react";
import * as d3 from "d3";

const MedianLine = ({ data, value, width, height, x, y, median }) => {
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, value)])
    .range([height - y, 0]);

  const line = d3.line()([[50, -5], [width, -5]]);

  const medianValue = median || d3.median(data, value);
  const medianLabel = `Median Household: $${yScale.tickFormat()(median)}`;

  return (
    <g transform={`translate(${x}, ${yScale(medianValue)})`}>
      <text x={width - 4} y="10" textAnchor="end" style={{ fontSize: "14px" }}>
        {medianLabel}
      </text>
      <path d={line} stroke="#343536cc" strokeWidth={2} strokeDasharray={4} />
    </g>
  );
};

export { MedianLine };
