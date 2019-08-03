import React from "react";
import groupBy from "lodash/groupBy";
import get from "lodash/get";
import uniq from "lodash/uniq";
import every from "lodash/every";
import capitalize from "lodash/capitalize";
import {
  Loading,
  Map,
  Histogram,
  MedianLine,
  Title,
  Description,
  Size,
  Select
} from "./components";
import { loadData } from "./lib/loadData";
import { countyValue } from "./lib/countyValue";
import "./style/base.css";

const App = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [topojson, setTopojson] = React.useState(null);
  const [techSalaries, setTechSalaries] = React.useState([]);
  const [medianIncomes, setMedianIncomes] = React.useState([]);
  const [medianIncomesByUsState, setMedianIncomesByUsState] = React.useState(
    {}
  );
  const [countyNames, setCountyNames] = React.useState([]);
  const [stateNames, setStateNames] = React.useState([]);
  const [filter, setFilter] = React.useState({
    usState: "*",
    year: "*",
    jobTitle: "*"
  });

  React.useEffect(() => {
    loadData().then(data => {
      setTopojson(data.us);
      setTechSalaries(data.techSalaries);
      setMedianIncomes(data.medianIncomes);
      setMedianIncomesByUsState(data.medianIncomesByUsState);
      setCountyNames(data.countyNames);
      setStateNames(data.usStateNames);
      setLoading(false);
    });
  }, []);

  const filteredSalaries = techSalaries.filter(salary =>
    every([
      filter.year === "*" ||
        salary.submitDate.getFullYear() === parseInt(filter.year, 10),
      filter.usState === "*" || salary.usState === filter.usState,
      filter.jobTitle === "*" || salary.jobTitle === filter.jobTitle
    ])
  );

  const salariesPerCounty = groupBy(filteredSalaries, "countyId");
  const medianIncomesByCounty = groupBy(medianIncomes, "countyName");
  const countyValues = countyNames
    .map(county => countyValue(county, salariesPerCounty, medianIncomes))
    .filter(x => !!x);

  const medianHousehold = get(medianIncomesByUsState, "US.0.medianIncome", 0);
  const jobTitles = uniq(techSalaries.map(d => d.jobTitle));
  const years = uniq(
    techSalaries.map(d => d.submitDate && d.submitDate.getFullYear())
  );

  return (
    <div className="flex flex-col min-h-screen p-16">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Title data={filteredSalaries} filter={filter} />
          <Description
            data={filteredSalaries}
            historicalData={techSalaries}
            filter={filter}
            medianIncomesByCounty={medianIncomesByCounty}
          />

          <div className="flex my-4">
            <Select
              label="Year"
              className="w-1/3"
              value={filter.year}
              onChange={e =>
                setFilter({
                  ...filter,
                  year: e.target.value
                })
              }
            >
              <option value="*">All</option>
              {years.map(year => (
                <option value={year}>{year}</option>
              ))}
            </Select>
            <Select
              label="Job title"
              className="w-1/3 mx-2"
              value={filter.jobTitle}
              onChange={e =>
                setFilter({
                  ...filter,
                  jobTitle: e.target.value
                })
              }
            >
              <option value="*">Any</option>
              {jobTitles.map(title => (
                <option value={title}>{capitalize(title)}</option>
              ))}
            </Select>
            <Select
              label="State"
              className="w-1/3"
              value={filter.usState}
              onChange={e =>
                setFilter({
                  ...filter,
                  usState: e.target.value
                })
              }
            >
              <option value="*">United States of America</option>
              {stateNames.map(({ code, name }) => (
                <option value={code}>{name}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-grow flex-col xl:flex-row">
            <div className="xl:w-2/3" style={{ "--aspect-ratio": 2 / 3 }}>
              <svg
                className="w-full h-full"
                width={500}
                height={500}
                viewBox="0 0 500 500"
                preserveAspectRatio="xMidYMid meet"
              >
                <Map
                  us={topojson}
                  countyValues={countyValues}
                  countyNames={countyNames}
                  stateNames={stateNames}
                  zoom={filter.usState !== "*" ? filter.usState : null}
                  x={0}
                  y={0}
                  width={500}
                  height={500}
                />
              </svg>
            </div>
            <div className="flex xl:w-1/3">
              <Size className="flex items-center">
                {({ width, height }) => (
                  <svg
                    width="100%"
                    height={300}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <Histogram
                      bins={10}
                      x={0}
                      y={0}
                      width={width}
                      height={300}
                      data={filteredSalaries}
                      value={d => d.baseSalary}
                    />
                    <MedianLine
                      data={filteredSalaries}
                      x={0}
                      y={0}
                      width={width}
                      height={300}
                      median={medianHousehold}
                      value={d => d.baseSalary}
                    />
                  </svg>
                )}
              </Size>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { App };
