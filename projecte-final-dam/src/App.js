import './App.css';
import { Board } from './components/Board';
import { ModuleBoard } from './components/ModuleBoard';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Chess Module</h1>
      </header>
      <body className='App-body'>        
        <div className='board'>
          <Board/>
        </div>
        <div className='moduleBoard'>
          <ModuleBoard/>
        </div>
        <div className='info'>
        </div>
      </body>
    </div>
  );
}

export default App;
