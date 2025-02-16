// src/components/CarbonTreemap.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

function CarbonTreemap({ targetCountry }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    console.log('CarbonTreemap: Starting CSV parse for country:', targetCountry);
    Papa.parse('/data/emissions.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        console.log('Papa.parse complete. Full results:', results);

        if (results.errors && results.errors.length > 0) {
          console.error('CSV Parsing errors:', results.errors);
        }

        results.data.forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });

        // Filter rows using the "Country" column (case-insensitive) and ensure Sector exists
        const countryRows = results.data.filter((row) => {
          return (
            row.Country &&
            row.Country.toLowerCase() === targetCountry.toLowerCase() &&
            row.Sector
          );
        });
        console.log('Filtered countryRows:', countryRows);

        // Build flat sector data using the 2021 column as value
        const sectorData = countryRows.map((row) => ({
          name: row.Sector,
          value: parseFloat(row['2021'] || 0),
        }));
        console.log('Flat sector data:', sectorData);

        // Transform into hierarchical data with a root node
        const treeData = [
          {
            name: targetCountry,
            children:
              sectorData.length > 0
                ? sectorData
                : [{ name: 'Placeholder Sector', value: 100 }],
          },
        ];
        console.log('Hierarchical tree data:', treeData);

        // setChartData(treeData);
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
      },
    });
  }, [targetCountry]);

  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        margin: '0 auto',
        border: '1px solid #ccc',
        padding: '0.5rem'
      }}
    >
      <h2>Treemap by Sector for {targetCountry}</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={chartData}
            dataKey="value"
            nameKey="name"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip />
          </Treemap>
        </ResponsiveContainer>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default CarbonTreemap;
