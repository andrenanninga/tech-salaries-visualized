import React from "react";
import * as d3 from "d3";
import { Bar } from "./Bar";
import { Axis } from "./Axis";

const Histogram = ({ bins, data, value, x, y, width, height }) => {
  const histogram = d3
    .histogram()
    .thresholds(bins)
    .value(value);

  const bars = histogram(data);
  const counts = bars.map(d => d.length);

  const widthScale = d3
    .scaleLinear()
    .domain([d3.min(counts), d3.max(counts)])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bars, d => d.x1)])
    .range([height - y, 0]);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {bars.map(bar => (
        <Bar
          key={bar.x0}
          percent={(bar.length / data.length) * 100}
          x={20}
          y={yScale(bar.x1)}
          width={widthScale(bar.length)}
          height={yScale(bar.x0) - yScale(bar.x1)}
        />
      ))}
      <Axis x={15} y={0} ticks={bars.length} scale={yScale} />
    </g>
  );
};

export { Histogram };
