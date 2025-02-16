import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import * as d3 from 'd3';

// Define a color palette for the cells.
const COLORS = [
  '#8884d8',
  '#83a6ed',
  '#8dd1e1',
  '#82ca9d',
  '#a4de6c',
  '#d0ed57',
  '#ffc658',
  '#ff8042',
  '#ffbb28',
];

function CarbonTreemap({ targetCountry, hideCountryName = false }) {
  const [allSectors, setAllSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState({});

  // Fetch and parse CSV data.
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/emissions.csv');
        const csvText = await response.text();
        console.log('Loaded CSV data:', csvText);

        const results = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
        });

        // Filter rows for the given country with a defined Sector.
        const filteredRows = results.data.filter(
          (row) =>
            row.Country &&
            row.Country.toLowerCase() === targetCountry.toLowerCase() &&
            row.Sector
        );

        // Map rows to an array of sector objects using the 2021 column.
        const sectors = filteredRows.map((row) => ({
          name: row.Sector,
          value: Number(row['2021']) || 0,
        }));

        setAllSectors(sectors);

        // Initialize each sector as selected except certain ones.
        const initialSelections = {};
        sectors.forEach((sector) => {
          initialSelections[sector.name] =
            (sector.name === 'Total excluding LUCF' ||
              sector.name === 'Total including LUCF')
              ? false
              : true;
        });
        setSelectedSectors(initialSelections);
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    }

    fetchData();
  }, [targetCountry]);

  // Filter sectors based on checkbox selections.
  const filteredSectors = allSectors.filter(
    (sector) => selectedSectors[sector.name]
  );

  // Build hierarchical data.
  const treeData = {
    name: targetCountry,
    children:
      filteredSectors.length > 0
        ? filteredSectors
        : [{ name: 'Placeholder Sector', value: 100 }],
  };

  // Dimensions for the treemap.
  const width = 1000;
  const height = 600;

  // Create the hierarchy and compute the treemap layout.
  const root = d3
    .hierarchy(treeData)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3.treemap().size([width, height]).padding(1)(root);

  // Handle checkbox state changes.
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSectors((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  return (
    <div style={{ position: 'relative', width: '1000px', margin: '0 auto' }}>
      {/* Header and checkboxes ... */}

      <svg width={1000} height={600}>
        {root.leaves().map((leaf, index) => {
          const x = leaf.x0;
          const y = leaf.y0;
          const rectWidth = leaf.x1 - leaf.x0;
          const rectHeight = leaf.y1 - leaf.y0;
          const fill = COLORS[index % COLORS.length];
          const fontSize = Math.max(6, Math.min(rectWidth, rectHeight) / 15);
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={rectWidth}
                height={rectHeight}
                stroke="#fff"
                fill={fill}
                onMouseEnter={(e) =>
                  setTooltip({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    content: `${leaf.data.name} (${leaf.data.value})`,
                  })
                }
                onMouseMove={(e) =>
                  setTooltip((prev) => ({
                    ...prev,
                    x: e.clientX,
                    y: e.clientY,
                  }))
                }
                onMouseLeave={() =>
                  setTooltip((prev) => ({
                    ...prev,
                    visible: false,
                  }))
                }
              />
              {rectWidth > 50 && rectHeight > 20 && (
                <text
                  x={x + rectWidth / 2}
                  y={y + rectHeight / 2}
                  textAnchor="middle"
                  fill="#000"
                  fontSize={fontSize}
                  alignmentBaseline="middle"
                >
                  {leaf.data.name} ({leaf.data.value})
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Render tooltip if visible */}
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '5px 10px',
            border: '1px solid #ccc',
            pointerEvents: 'none',
            fontSize: '12px',
            borderRadius: '4px',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

export default CarbonTreemap;