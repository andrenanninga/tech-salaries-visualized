import React from "react";
import * as d3 from "d3";
import useD3 from "../../hooks/useD3";

const Axis = ({ x = 0, y = 0, scale, ticks }) => {
  const [ref] = useD3(element => {
    const axis = d3
      .axisLeft()
      .tickFormat(d => `$${d3.format(".2s")(d)}`)
      .scale(scale)
      .ticks(ticks);

    d3.select(element).call(axis);
  });

  return <g transform={`translate(${x}, ${y})`} ref={ref} />;
};

export { Axis };
