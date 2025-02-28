import "./App.css";
import Game from "./components/LocationTrivia";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Globetrotter Challenge</h1>
        <Game />
      </header>
    </div>
  );
}

export default App;