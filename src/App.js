import React from 'react';
import Canvas from './components/Canvas'
import {hot} from 'react-hot-loader';
import './App.css';

function App() {
  return (
    <div className="App">
      <Canvas />
    </div>
  );
}

export default hot(module)(App);
