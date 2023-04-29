import './App.css';
import { Board } from './components/Board';
import { ModuleBoard } from './components/ModuleBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TEST</h1>
        <div className='tablero'>
          <Board/>
        </div>
      </header>
    </div>
  );
}

export default App;
