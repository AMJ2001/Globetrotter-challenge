import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

interface Destination {
  name: string;
  clues: string[];
  funFact: string;
}

const destinations: Destination[] = [
  {
    name: "Paris",
    clues: ["Known for its iconic tower", "Famous for croissants"],
    funFact: "The Eiffel Tower can be 15 cm taller during the summer!",
  },
  {
    name: "Tokyo",
    clues: ["Has the busiest pedestrian crossing", "Famous for sushi"],
    funFact: "There are more than 1500 earthquakes in Japan every year!",
  },
  {
    name: "New York",
    clues: ["Home to a famous statue", "Known as the Big Apple"],
    funFact: "New York City has over 800 languages spoken!",
  },
];

const LocationTrivia: React.FC = () => {
  const [usedDestinations, setUsedDestinations] = useState<Destination[]>([]);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [extraClue, setExtraClue] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    if (usedDestinations.length === destinations.length) {
      setUsedDestinations([]); 
    }
    
    const availableDestinations = destinations.filter(dest => !usedDestinations.includes(dest));
    if (availableDestinations.length === 0) return;

    const randomDestination = availableDestinations[Math.floor(Math.random() * availableDestinations.length)];
    setCurrentDestination(randomDestination);
    setUsedDestinations([...usedDestinations, randomDestination]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setExtraClue(null);
  };

  const handleAnswer = (answer: string) => {
    if (!currentDestination) return;
    const correct = answer === currentDestination.name;
    setIsCorrect(correct);
    if (correct) setScore((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white text-center">
      {isCorrect && <Confetti />}
      {currentDestination ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Guess the Destination</h1>
          <p className="text-lg mb-4">{currentDestination.clues[0]}</p>
        
          {extraClue && <p className="mt-2 text-lg">{extraClue}</p>}

          <div className="grid grid-cols-2 gap-4">
            {destinations.map((dest) => (
              <motion.button
                className="px-6 py-2 rounded-lg text-lg font-semibold transition-all bg-blue-500 hover:bg-blue-600"
                key={dest.name} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(dest.name)}>
                {dest.name}
              </motion.button>
            ))}
          </div>
          <button className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-900 transition"
            onClick={() => setExtraClue(currentDestination.clues[1])}>
            Get another clue
          </button>

          {isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 rounded-lg text-lg"
            >
              {isCorrect ? (
                <div>
                  <p className="text-green-400">🎉 Correct! </p>
                  <p> Fun fact : {currentDestination.funFact} </p>
                  <button
                    onClick={loadNewQuestion}
                    className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-semibold"
                  >
                    Next Question
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-red-400">😢 Incorrect!</p>
                  <p> Correct answer was: {currentDestination.name}</p>
                  <p> Did you know? : {currentDestination.funFact} </p>
                  <button
                    onClick={loadNewQuestion}
                    className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-semibold"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </motion.div>
          )}
          <p className="mt-6 text-lg font-semibold">Score: {score}</p>
        </>
      ) : (
        <p className="text-lg">Loading question...</p>
      )}
    </div>
  );
};

export default LocationTrivia;