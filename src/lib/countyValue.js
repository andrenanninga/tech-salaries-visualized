import * as d3 from "d3";

function countyValue(county, techSalaries) {
  const medianHousehold = this.state.medianIncomes[county.id];
  const salaries = techSalaries[county.name];

  if (!medianHousehold || !salaries) {
    return null;
  }

  const median = d3.median(salaries, d => d.base_salary);

  return {
    countyId: county.id,
    value: median - medianHousehold.medianIncome
  };
}
