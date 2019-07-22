import React from "react";
import groupBy from "lodash/groupBy";
import { Loading, Map, Histogram } from "./components";
import { loadData } from "./lib/loadData";
import { countyValue } from "./lib/countyValue";
import "./style/base.css";

const App = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [topojson, setTopojson] = React.useState(null);
  const [techSalaries, setTechSalaries] = React.useState([]);
  const [medianIncomes, setMedianIncomes] = React.useState([]);
  const [countyNames, setCountyNames] = React.useState([]);
  const [stateNames, setStateNames] = React.useState([]);

  React.useEffect(() => {
    loadData().then(data => {
      setTopojson(data.us);
      setTechSalaries(data.techSalaries);
      setMedianIncomes(data.medianIncomes);
      setCountyNames(data.countyNames);
      setStateNames(data.usStateNames);
      setLoading(false);
    });
  }, []);

  const filteredSalaries = techSalaries;
  const salariesPerCounty = groupBy(filteredSalaries, "countyId");
  const countyValues = countyNames
    .map(county => countyValue(county, salariesPerCounty, medianIncomes))
    .filter(x => !!x);

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1>Loaded {techSalaries.length} salaries</h1>

          <div style={{ "--aspect-ratio": 2 / 3 }}>
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
          <div style={{ "--aspect-ratio": 2 / 3 }}>
            <svg
              className="w-full h-full"
              width={500}
              height={500}
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
            >
              <Histogram
                bins={10}
                x={0}
                y={0}
                width={500}
                height={500}
                data={filteredSalaries}
                value={d => d.baseSalary}
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export { App };
