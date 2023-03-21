import { useState } from 'react';
import './App.css';
const wait = s => new Promise(r => setTimeout(r, s * 1000));
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}


const context = new AudioContext();
let cntr = 0;
const makeSound = () => {
  const sound = context.createOscillator();
  const fourthBeat = cntr++ % 4 === 0;
  sound.frequency.value = fourthBeat ? 400 : 440;
  sound.connect(context.destination);
  sound.start(context.currentTime);
  sound.stop(context.currentTime + .1);
};

let metrenomeLooping = false;
const START_BPM = 115;
let metrenomeBPM = START_BPM;
const start = async () => {
  while (metrenomeLooping === true) {
    makeSound();
    await wait(60 / metrenomeBPM);
  }
  cntr = 0;
};



function App() {
  const [bpm, setBpm] = useState(START_BPM);
  const [running, setRunning] = useState(false);

  const btnHandler = () => {
    const newRunState = !running;
    setRunning(newRunState);
    metrenomeLooping = newRunState;
    if (newRunState === true) start();
  };

  const bpmHandler = e => {
    metrenomeBPM = e.target.value;
    setBpm(e.target.value);
  }

  return (
    <div className="App">
      <div className={"display" + (running ? " running" : "")}>{bpm}</div>
      <input onChange={bpmHandler} min="30" max="200" value={bpm} type="range" />
      <button onClick={btnHandler} className="runBtn">{running ? "Stop" : "Start"}</button>
    </div>
  )
}

export default App
