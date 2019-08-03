import React from "react";
import * as d3 from "d3";

const County = React.memo(({ geoPath, scale, feature, value, muted }) => {
  const color = value ? d3.interpolateRdYlGn(scale(value)) : "#E2E8F0";

  return (
    <path
      d={geoPath(feature)}
      fill={color}
      stroke={muted ? null : color}
      title={feature.id}
      style={{ opacity: muted ? 0.2 : 1 }}
    />
  );
});

export { County };
