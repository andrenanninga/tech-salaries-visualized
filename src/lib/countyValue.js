import * as d3 from "d3";

function countyValue(county, salariesPerCounty, medianIncomes) {
  const medianIncomesInCounty = medianIncomes[county.id];
  const salariesInCounty = salariesPerCounty[county.name];

  if (!medianIncomesInCounty || !salariesInCounty) {
    return null;
  }

  const median = d3.median(salariesInCounty, d => d.baseSalary);

  return {
    countyId: county.id,
    value: median - medianIncomesInCounty.medianIncome
  };
}

export { countyValue };
