import React from "react";
import * as d3 from "d3";
import states from "../lib/states";

const Description = ({ data, filter }) => {
  const { usState, year, jobTitle } = filter;

  const format = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.baseSalary))
    .tickFormat();

  const mean = format(d3.mean(data, d => d.baseSalary));

  const earn = year === "*" ? "earns" : "earned";
  const person =
    jobTitle === "*" ? "H1B in tech" : `software ${jobTitle} on a H1B`;
  const location = usState === "*" ? "the USA" : states[usState];
  const salary = year === "*" ? `$${mean}/year` : `$${mean} in ${year}`;

  return (
    <p className="text-center text-lg">
      In {location} a {person} {earn} on average {salary}
    </p>
  );
};

export { Description };
