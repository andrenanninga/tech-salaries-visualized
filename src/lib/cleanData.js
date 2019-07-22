import * as d3 from "d3";
import find from "lodash/find";

const parseDate = d3.timeParse("%m/%d/%y");

const cleanIncome = d => ({
  countyName: d.Name,
  usState: d.State,
  medianIncome: Number(d["Median Household Income"]),
  lowerBound: Number(d["90% CI Lower Bound"]),
  upperBound: Number(d["90% CI Upper Bound"])
});

const cleanSalary = d => {
  if (!d["base salary"] || Number(d["base salary"]) > 300000) {
    return null;
  }

  return {
    employer: d.employer,
    submitDate: parseDate(d["submit date"]),
    startDate: parseDate(d["start date"]),
    caseStatus: parseDate(d["case status"]),
    jobTitle: d["job title"],
    cleanJobTitle: d["job title"],
    baseSalary: Number(d["base salary"]),
    city: d.city,
    usState: d.state,
    county: d.county,
    countyId: d.countyID
  };
};

const cleanUsStateName = d => ({
  code: d.code,
  id: Number(d.id),
  name: d.name
});

const cleanCounty = d => ({
  id: Number(d.id),
  name: d.name
});

const parseIncomes = (incomes, countyNames) => {
  const incomesDict = {};

  incomes
    .filter(d => find(countyNames, { name: d["countyName"] }))
    .forEach(d => {
      d["countyID"] = find(countyNames, { name: d["countyName"] }).id;
      incomesDict[d.countyID] = d;
    });

  return incomesDict;
};

const parseSalaries = salaries => {
  return salaries.filter(x => !!x);
};

export {
  cleanIncome,
  cleanSalary,
  cleanUsStateName,
  cleanCounty,
  parseIncomes,
  parseSalaries
};
