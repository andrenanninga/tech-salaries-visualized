import React from "react";
import css from "astroturf";
import { Loading, Map } from "./components";
import { loadData } from "./lib/loadData";
import "./style.css";

css`
  [style*="--aspect-ratio"] > :first-child {
    width: 100%;
  }
  @supports (--custom: property) {
    [style*="--aspect-ratio"] {
      position: relative;
    }
    [style*="--aspect-ratio"]::before {
      content: "";
      display: block;
      padding-bottom: calc(100% * (var(--aspect-ratio)));
    }
    [style*="--aspect-ratio"] > :first-child {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  }
`;

const App = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [topojson, setTopojson] = React.useState(null);
  const [techSalaries, setTechSalaries] = React.useState([]);
  const [medianIncomes, setMedianIncomes] = React.useState([]);
  const [countyNames, setCountyNames] = React.useState([]);

  React.useEffect(() => {
    loadData().then(data => {
      setLoading(false);
      setTopojson(data.us);
      setTechSalaries(data.techSalaries);
      setMedianIncomes(data.medianIncomes);
      setCountyNames(data.countyNames);
    });
  }, []);

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
              <Map us={topojson} x={0} y={0} width={500} height={500} />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export { App };
