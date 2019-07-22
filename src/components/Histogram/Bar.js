import React from "react";

const Bar = ({ percent, x, y, width, height }) => {
  const label = `${percent.toFixed(0)}%`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height - 2}
        transform="translate(0, 1)"
        fill="#4299E1"
      />
      {percent >= 2 ? (
        <text
          className="text-sm"
          fill="white"
          textAnchor="end"
          dominantBaseline="middle"
          vectorEffect="non-scaling-stroke"
          x={width - 5}
          y={height / 2 + 2}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};
export { Bar };
