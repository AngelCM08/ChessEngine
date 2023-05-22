import './App.css';
import { Board } from './components/Board';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Chess Module</h1>
      </header>
      <div className='App-body'>
          <Board/>
      </div>
    </div>
  );
}
export default App;