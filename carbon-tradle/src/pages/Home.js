import React from 'react';
import Treemap from '../components/Treemap';
import GuessForm from '../components/GuessForm';

function Home() {
  return (
    <div style={{ margin: '0 auto'}}>
      <Treemap />
      <GuessForm />
    </div>
  );
}

export default Home;
