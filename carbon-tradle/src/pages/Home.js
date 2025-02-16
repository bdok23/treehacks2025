// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import GuessForm from '../components/GuessForm';
import CarbonTreemap from '../components/CarbonTreemap';
import {
  calculateDistance,
  calculateDirection,
  calculateProximity,
} from '../utils/distanceUtils';

function Home() {
  // State for target country, last guess, guesses, unique country list, and treemap toggle.
  const [targetCountry, setTargetCountry] = useState('');
  const [lastGuessedCountry, setLastGuessedCountry] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [uniqueCountries, setUniqueCountries] = useState([]);
  const [showGuessTreemap, setShowGuessTreemap] = useState(true);

  const maxGuesses = 6;
  // Hardcoded list to randomize target country.
  const hardcodedTargetCountries = ['China', 'United States', 'India', 'Brazil', 'Russia'];

  // Randomize target country on mount.
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * hardcodedTargetCountries.length);
    setTargetCountry(hardcodedTargetCountries[randomIndex]);
  }, []);

  // Load CSV and extract unique country names.
  useEffect(() => {
    async function fetchUniqueCountries() {
      try {
        const response = await fetch('/data/emissions.csv');
        const csvText = await response.text();
        const results = Papa.parse(csvText, { header: true, dynamicTyping: true });
        const countrySet = new Set();
        results.data.forEach((row) => {
          if (row.Country) {
            countrySet.add(row.Country);
          }
        });
        const countryArray = Array.from(countrySet).sort();
        setUniqueCountries(countryArray);
      } catch (error) {
        console.error('Error fetching unique countries:', error);
      }
    }
    fetchUniqueCountries();
  }, []);

  const handleGuess = (guess) => {
    console.log('Received guess:', guess);
    setGuesses((prevGuesses) => [...prevGuesses, guess]);
    setLastGuessedCountry(guess);

    if (guess.toLowerCase() === targetCountry.toLowerCase()) {
      alert('Correct! You guessed ' + guess);
    } else {
      alert('Wrong guess! Try again!');
    }

    const distance = calculateDistance(guess, targetCountry);
    const direction = calculateDirection(guess, targetCountry);
    const proximity = calculateProximity(distance);
    console.log('Distance:', distance, 'Direction:', direction, 'Proximity:', proximity);

    alert(
      `Your guess ${guess} is ${distance} km away, direction ${direction}, ` +
      `with a proximity of ${proximity}%. Keep trying!`
    );
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <h1>Carbon TRADLE - Home</h1>
      
      {/* Target country treemap (country name is hidden) */}
      <div>
        <h2>Target Country Treemap</h2>
        {targetCountry ? (
          <CarbonTreemap targetCountry={targetCountry} hideCountryName={true} />
        ) : (
          <p>Loading target country...</p>
        )}
      </div>
      
      
      
      {/* Most recent guess treemap with toggle */}
      <div style={{ marginTop: '2rem' }}>
        <h2>
          {lastGuessedCountry
            ? `Your Guess Treemap (${lastGuessedCountry})`
            : 'Your Guess Treemap (No guess yet)'}
        </h2>
        {lastGuessedCountry && (
          <button onClick={() => setShowGuessTreemap((prev) => !prev)}>
            {showGuessTreemap ? 'Hide' : 'Show'} Guess Treemap
          </button>
        )}
        {lastGuessedCountry ? (
          showGuessTreemap ? (
            <CarbonTreemap targetCountry={lastGuessedCountry} />
          ) : (
            <p>Guess treemap hidden.</p>
          )
        ) : (
          <p>Please enter a guess to see the treemap for that country.</p>
        )}
      </div>

      {/* Guess Placeholders with styled boxes */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h3>Your Guesses</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto', width: 'fit-content' }}>
          {Array.from({ length: maxGuesses }).map((_, index) => (
            <li
              key={index}
              style={{
                border: '2px solid #999',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '0.75rem',
                maxWidth: '600px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {guesses[index]
                ? `Guess ${index + 1}: ${guesses[index]}`
                : `Guess ${index + 1}: ---`}
            </li>
          ))}
        </ul>
      </div>


      {/* Guess form using a dropdown populated by unique countries */}
      <div style={{ marginTop: '2rem' }}>
        {guesses.length < maxGuesses ? (
          <GuessForm onGuess={handleGuess} uniqueCountries={uniqueCountries} />
        ) : (
          <p>No more guesses allowed.</p>
        )}
      </div>
      <div style={{ marginTop: '500px' }}>

      </div>
    </div>
  );
}

export default Home;
