import React from "react";
import { scaleLinear } from "d3-scale";
import {
  mean as d3mean,
  extent as d3extent,
  deviation as d3deviation
} from "d3-array";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import keys from "lodash/keys";
import S from "string";
import usStates from "../lib/states";

class Description extends React.Component {
  historicalDataForYear(year, data = this.props.historicalData) {
    return data.filter(d => d.submitDate.getFullYear() === year);
  }

  historicalDataForJobTitle(jobTitle, data = this.props.historicalData) {
    return data.filter(d => d.cleanJobTitle === jobTitle);
  }

  historicalDataForusState(usState, data = this.props.historicalData) {
    return data.filter(d => d.usState === usState);
  }

  get yearsFragment() {
    const year = this.props.filter.year;

    return year === "*" ? "" : `In ${year}`;
  }

  get usStateFragment() {
    const usState = this.props.filter.usState;

    return usState === "*" ? "" : usStates[usState.toUpperCase()];
  }

  get previousYearFragment() {
    const year = this.props.filter.year;

    let fragment;

    if (year === "*") {
      fragment = "";
    } else if (year === 2012) {
      fragment = "";
    } else {
      const { usState, jobTitle } = this.props.filter;
      let lastYear = this.historicalDataForYear(year - 1);

      if (jobTitle !== "*") {
        lastYear = this.historicalDataForJobTitle(jobTitle, lastYear);
      }

      if (usState !== "*") {
        lastYear = this.historicalDataForusState(usState, lastYear);
      }

      if (this.props.data.length / lastYear.length > 2) {
        fragment =
          ", " +
          (this.props.data.length / lastYear.length).toFixed() +
          " times more than the year before";
      } else {
        const percent = (
          (1 - lastYear.length / this.props.data.length) *
          100
        ).toFixed();

        fragment =
          ", " +
          Math.abs(percent) +
          "% " +
          (percent > 0 ? "more" : "less") +
          " than the year before";
      }
    }

    return fragment;
  }

  get jobTitleFragment() {
    const jobTitle = this.props.filter.jobTitle;
    let fragment;

    if (jobTitle === "*") {
      fragment = "H1B work visas";
    } else {
      if (jobTitle === "other") {
        fragment = "H1B work visas";
      } else {
        fragment = `H1B work visas for software ${jobTitle}s`;
      }
    }

    return fragment;
  }

  get countyFragment() {
    const byCounty = groupBy(this.props.data, "countyId");
    const medians = this.props.medianIncomesByCounty;

    let ordered = sortBy(
      keys(byCounty)
        .map(county => byCounty[county])
        .filter(d => d.length / this.props.data.length > 0.01),
      items =>
        d3mean(items, d => d.baseSalary) -
        medians[items[0].countyId][0].medianIncome
    );

    let best = ordered[ordered.length - 1];
    let countyMedian = medians[best[0].countyId][0].medianIncome;

    const byCity = groupBy(best, "city");

    ordered = sortBy(
      keys(byCity)
        .map(city => byCity[city])
        .filter(d => d.length / best.length > 0.01),
      items => d3mean(items, d => d.baseSalary) - countyMedian
    );

    best = ordered[ordered.length - 1];

    const city = S(best[0].city).titleCase().s + `, ${best[0].usState}`,
      mean = d3mean(best, d => d.baseSalary);

    const jobFragment = this.jobTitleFragment
      .replace("H1B work visas for", "")
      .replace("H1B work visas", "");

    return (
      <span>
        The best city{" "}
        {jobFragment.length ? `for ${jobFragment} on an H1B` : "for an H1B"}{" "}
        {this.yearFragment ? "was" : "is"} <em>{city}</em> with an average
        salary ${this.format(mean - countyMedian)} above the local household
        median. Median household income is a good proxy for cost of living in an
        area. <a href="https://en.wikipedia.org/wiki/Household_income">[1]</a>.
      </span>
    );
  }

  get format() {
    return scaleLinear()
      .domain(d3extent(this.props.data, d => d.baseSalary))
      .tickFormat();
  }

  render() {
    const format = this.format,
      mean = d3mean(this.props.data, d => d.baseSalary),
      deviation = d3deviation(this.props.data, d => d.baseSalary);

    return (
      <p className="leading-relaxed">
        {this.yearsFragment ? this.yearsFragment : "Since 2012"} the{" "}
        {this.UStateFragment} tech industry{" "}
        {this.yearsFragment ? "sponsored" : "has sponsored"}{" "}
        <em>
          {format(this.props.data.length)} {this.jobTitleFragment}
        </em>
        {this.previousYearFragment}. Most of them paid{" "}
        <em>
          ${format(mean - deviation)} to ${format(mean + deviation)}
        </em>{" "}
        per year. {this.countyFragment}
      </p>
    );
  }
}

export { Description };
