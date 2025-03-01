import { motion } from "framer-motion";
import "./App.css";
import Game from "./components/LocationTrivia";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <motion.h1 className="text-4xl font-bold mb-4 cursor-pointer relative flex items-center"
        whileHover={{ scale: 1.1 }}>
        <span>Welcome to Globetrotter Challenge</span>
        <motion.span className="ml-2"
          whileHover={{ x: 20, rotate: 360 }}
          transition={{ duration: 0.8, ease: "easeInOut", repeat: 2, repeatType: "reverse" }}>
          🌍
        </motion.span>
      </motion.h1>
        <Game />
      </header>
    </div>
  );
}

export default App;