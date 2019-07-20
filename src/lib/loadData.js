import * as d3 from "d3";
import groupBy from "lodash/groupBy";
import {
  cleanIncome,
  cleanSalary,
  cleanCounty,
  cleanUsStateName,
  parseIncomes,
  parseSalaries
} from "./cleanData";

const loadData = async () =>
  Promise.all([
    d3.json("/static/data/us.json"),
    d3.csv("/static/data/us-county-names-normalized.csv", cleanCounty),
    d3.csv("/static/data/county-median-incomes.csv", cleanIncome),
    d3.csv("/static/data/h1bs-2012-2016-shortened.csv", cleanSalary),
    d3.tsv("/static/data/us-state-names.tsv", cleanUsStateName)
  ]).then(([us, countyNames, medianIncomes, techSalaries, usStateNames]) => {
    return {
      us,
      countyNames,
      medianIncomes: parseIncomes(medianIncomes, countyNames),
      medianIncomesByCounty: groupBy(medianIncomes, "countyName"),
      medianIncomesByUsState: groupBy(medianIncomes, "usState"),
      techSalaries: parseSalaries(techSalaries),
      usStateNames
    };
  });
export { loadData };
