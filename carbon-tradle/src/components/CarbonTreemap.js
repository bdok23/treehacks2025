// src/components/CarbonTreemap.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Treemap, Tooltip } from 'recharts';

function CarbonTreemap({ targetCountry }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/emissions.csv');
        const csvText = await response.text();
        const results = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
        });
        // Filter rows by the "Country" column (case-insensitive) that have a Sector defined
        const filtered = results.data.filter(
          (row) =>
            row.Country &&
            row.Country.toLowerCase() === targetCountry.toLowerCase() &&
            row.Sector
        );
        // Map rows to sector data using the '2021' column as value
        const sectorData = filtered.map((row) => ({
          name: row.Sector,
          value: Number(row['2021']) || 0,
        }));
        // Wrap data in a root node to form hierarchical data
        const treeData = [
          {
            name: targetCountry,
            children:
              sectorData.length > 0
                ? sectorData
                : [{ name: 'Placeholder Sector', value: 100 }],
          },
        ];
        setChartData(treeData);
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    }
    fetchData();
  }, [targetCountry]);

  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        margin: '0 auto',
        border: '1px solid #ccc',
        padding: '0.5rem',
      }}
    >
      <h2>Treemap by Sector for {targetCountry}</h2>
      {chartData.length > 0 ? (
        <Treemap
          width={400}
          height={400}
          data={chartData}
          dataKey="value"
          nameKey="name"
          stroke="#fff"
          fill="#8884d8"
        >
          <Tooltip />
        </Treemap>
        // <p>hi</p>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default CarbonTreemap;
