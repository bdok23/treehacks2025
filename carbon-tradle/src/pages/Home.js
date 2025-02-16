// src/pages/Home.js
import React, { useState } from 'react';
import GuessForm from '../components/GuessForm';
import CarbonTreemap from '../components/CarbonTreemap';
import {
  calculateDistance,
  calculateDirection,
  calculateProximity,
} from '../utils/distanceUtils';

function Home() {
  // Use full country name "China" as the target country
  const [targetCountry, setTargetCountry] = useState('China');
  const [lastGuessedCountry, setLastGuessedCountry] = useState(null);
  const [guesses, setGuesses] = useState([]);

  const handleGuess = (guess) => {
    console.log('Received guess:', guess);
    setGuesses((prevGuesses) => [...prevGuesses, guess]);
    setLastGuessedCountry(guess);

    if (guess.toLowerCase() === targetCountry.toLowerCase()) {
      alert('Correct! You guessed ' + guess);
    } else {
      alert('Wrong guess! Try again!');
    }

    // Example usage of distance utils
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
    <div>
      <h1>Carbon TRADLE - Home</h1>
      
      {/* Target country treemap */}
      <div>
        <h2>Target Country Treemap ({targetCountry})</h2>
        <CarbonTreemap targetCountry={targetCountry} />
        {/* <p>hiii</p> */}
      </div>
      
      {/* Most recent guess treemap */}
      <div style={{ marginTop: '2rem' }}>
        <h2>
          {lastGuessedCountry
            ? `Your Guess Treemap (${lastGuessedCountry})`
            : 'Your Guess Treemap (No guess yet)'}
        </h2>
        {lastGuessedCountry ? (
          <CarbonTreemap targetCountry={lastGuessedCountry} />
            // <p>hi</p>
        ) : (
          <p>Please enter a guess to see the treemap for that country.</p>
        )}
      </div>

      {/* Guess form */}
      <div style={{ marginTop: '2rem' }}>
        <GuessForm onGuess={handleGuess} />
      </div>
    </div>
  );
}

export default Home;
