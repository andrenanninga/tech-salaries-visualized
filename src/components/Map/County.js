import React from "react";
import * as d3 from "d3";

const County = React.memo(({ geoPath, scale, feature, value }) => {
  const color = value ? d3.interpolateRdYlGn(scale(value)) : "#E2E8F0";

  return (
    <path d={geoPath(feature)} fill={color} stroke={color} title={feature.id} />
  );
});

export { County };
