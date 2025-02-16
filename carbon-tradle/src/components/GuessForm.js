import React, { useState } from 'react';

function GuessForm() {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle guess submission logic here
    console.log('User guessed:', guess);
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
