// src/components/GuessForm.js
import React, { useState } from 'react';

function GuessForm({ onGuess }) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuess(guess);
    setGuess('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="countryGuess">Guess the Country:</label>
      <input
        id="countryGuess"
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type a country..."
      />
      <button type="submit">Guess</button>
    </form>
  );
}

export default GuessForm;
