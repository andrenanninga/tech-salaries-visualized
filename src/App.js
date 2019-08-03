import React from "react";
import groupBy from "lodash/groupBy";
import get from "lodash/get";
import {
  Loading,
  Map,
  Histogram,
  MedianLine,
  Title,
  Description,
  Size
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

  const filteredSalaries = techSalaries;
  const salariesPerCounty = groupBy(filteredSalaries, "countyId");
  const medianIncomesByCounty = groupBy(medianIncomes, "countyName");
  const countyValues = countyNames
    .map(county => countyValue(county, salariesPerCounty, medianIncomes))
    .filter(x => !!x);

  const medianHousehold = get(medianIncomesByUsState, "US.0.medianIncome", 0);

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
                  stateNames={stateNames}
                  zoom={null}
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
