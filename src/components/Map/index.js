import React from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import fromPairs from "lodash/fromPairs";
import find from "lodash/find";
import { County } from "./County";

const Map = ({ us, countyValues, stateNames, width, height, zoom }) => {
  if (!us) {
    return null;
  }

  const projection = d3.geoAlbersUsa().scale(1280);
  const geoPath = d3.geoPath().projection(projection);
  const scale = d3
    .scaleLinear()
    .range([0, 1])
    .clamp(true)
    .domain([
      d3.quantile(countyValues, 0.15, d => d.value),
      d3.quantile(countyValues, 0.85, d => d.value)
    ]);

  projection.translate([width / 2, height / 2]).scale(width * 1.3);

  if (us && zoom && stateNames) {
    const states = topojson.feature(us, us.objects.states).features;
    const id = find(stateNames, { code: zoom }).id;

    projection.scale(width * 4.5);

    const centroid = geoPath.centroid(find(states, { id }));
    const translate = projection.translate();

    projection.translate([
      translate[0] - centroid[0] + width / 2,
      translate[1] - centroid[1] + height / 2
    ]);
  }

  const usBorder = topojson.mesh(us, us.objects.states, (a, b) => a === b);
  const stateBorders = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
  const counties = topojson.feature(us, us.objects.counties).features;

  const valuePerCounty = fromPairs(
    countyValues.map(d => [d.countyId, d.value])
  );

  return (
    <g>
      {counties.map(county => (
        <County
          key={county.id}
          feature={county}
          geoPath={geoPath}
          value={valuePerCounty[county.id]}
          scale={scale}
        />
      ))}
      <path
        d={geoPath(stateBorders)}
        fill="none"
        stroke="#A3BFFA"
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={geoPath(usBorder)}
        fill="none"
        stroke="#7F9CF5"
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
};

export { Map };
