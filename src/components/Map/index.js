import React from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { County } from "./County";

const Map = ({ us, width, height }) => {
  if (!us) {
    return null;
  }

  const projection = d3.geoAlbersUsa().scale(1280);
  const geoPath = d3.geoPath().projection(projection);
  const quantize = d3.scaleQuantize().range(d3.range(9));

  projection.translate([width / 2, height / 2]).scale(width * 1.3);

  const country = topojson.mesh(us, us.objects.states, (a, b) => a === b);

  return (
    <g>
      <path
        d={geoPath(country)}
        fill="none"
        stroke="#f0f"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
};

export { Map };
