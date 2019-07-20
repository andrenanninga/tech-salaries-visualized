import React from "react";
import * as d3 from "d3";
import { Loading } from "./components";
import { loadData } from "./lib/loadData";
import "./style.css";

const App = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [techSalaries, setTechSalaries] = React.useState([]);
  const [medianIncomes, setMedianIncomes] = React.useState([]);
  const [countyNames, setCountyNames] = React.useState([]);

  React.useEffect(() => {
    loadData().then(data => {
      console.log(data);
      setLoading(false);
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
          <h1>Loaded {medianIncomes.length} incomes</h1>
          <h1>Loaded {countyNames.length} county names</h1>
        </>
      )}
    </div>
  );
};

export { App };
