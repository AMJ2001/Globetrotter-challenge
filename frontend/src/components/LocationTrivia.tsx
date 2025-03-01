import React, { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

interface Destination {
  city: string;
  country: string;
  trivia: string[];
  clues: string[];
  funFact: string[];
}

const LocationTrivia: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [usedDestinations, setUsedDestinations] = useState<Destination[]>([]);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [extraClue, setExtraClue] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [{ correct, incorrect }, setScore] = useState<Record<string, number>>({ correct: 0, incorrect: 0 });
  const [options, setOptions] = useState<string[]>([]);
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [showClue, setShowClue] = useState(false);

  const generateOptions = (correctDestination: Destination, data: Destination[]) => {
    const otherCities = data.map(dest => dest.city).filter(city => city !== correctDestination.city);
    const randomOptions = [...otherCities.sort(() => 0.5 - Math.random()).slice(0, 2), correctDestination.city].sort(() => Math.random() - 0.5);
    setOptions(randomOptions);
  };

  const loadNewQuestion = useCallback((data: Destination[], used: Destination[]) => {
    if (used.length === data.length) {
      setUsedDestinations([]);
      used = [];
    }
    const availableDestinations = data.filter(dest => !used.includes(dest));
    if (availableDestinations.length === 0) return;
    const randomDestination = availableDestinations[Math.floor(Math.random() * availableDestinations.length)];
    setCurrentDestination(randomDestination);
    setUsedDestinations([...used, randomDestination]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setExtraClue(null);
    setShowTrivia(false);
    setShowClue(false);
    generateOptions(randomDestination, data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://globetrotter-challenge-production-c574.up.railway.app/api/destinations", { 
          mode: 'cors',
          headers: { 'Access-Control-Allow-Origin':'*' }
        });
        const data = await res.json();
        setDestinations(data);
        loadNewQuestion(data, []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
      }
    };

    fetchData();
  }, [loadNewQuestion]);

  const handleAnswer = (answer: string) => {
    if (!currentDestination) return;
    const correct = answer === currentDestination.city;
    setIsCorrect(correct);
    correct
      ? setScore(prev => ({ correct:  prev.correct + 1, incorrect: prev.incorrect }))
      : setScore(prev => ({ incorrect:  prev.incorrect + 1, correct: prev.correct }))
  }

  return (
    <div className="flex flex-col items-center justify-center text-white text-center">
      { localStorage.getItem("targetScore") && (<h4>Active Challenge: Score more than {localStorage.getItem("targetScore")}</h4>) }
      {isCorrect && <Confetti />}
      {currentDestination ? (
        <>
          <p className="text-lg mb-4">{currentDestination.clues[0]}</p>
          {extraClue && <p className="mt-2 text-lg">{extraClue}</p>}

          <div className="flex gap-4 mt-4">
            {options.map((option) => (
              <motion.button
                key={option}
                className={`px-6 py-2 rounded-lg text-lg font-semibold backdrop-blur-lg bg-white/20 border border-white/30 transition-all shadow-md 
                  ${isCorrect === null ? "hover:bg-white/30" : option === selectedAnswer ? (isCorrect ? "bg-green-400/40" : "bg-red-400/40") : ""}`}
                whileTap={isCorrect === null ? { scale: 0.95 } : isCorrect ? { scale: 1.2, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)" } : { rotate: [0, -10, 10, -10, 0] }}
                onClick={() => { 
                  if (!selectedAnswer) {
                    setSelectedAnswer(option);
                    handleAnswer(option); 
                  }
                }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          <motion.button 
            className="mt-4 p-3 bg-white/20 backdrop-blur-lg border border-white/30 shadow-md rounded-lg transition-all"
            whileHover={{ rotateY: 180 }}
            onClick={() => setShowClue(true)}>
            {showClue ? currentDestination.clues[1] : "Get another clue"}
          </motion.button>

          {isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 rounded-lg text-lg">
              {isCorrect ? (
                <div>
                  <p className="text-green-400">🎉 Correct! </p>
                  <p>Fun fact: {currentDestination.funFact[0]}</p>
                  {!showTrivia && (
                    <button onClick={() => setShowTrivia(true)} className="mt-2 px-4 py-1 bg-gray-500 rounded">Show Trivia</button>
                  )}
                  {showTrivia && <p>Trivia: {currentDestination.trivia[0]}</p>}
                  <button onClick={() => loadNewQuestion(destinations, usedDestinations)}
                    className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-semibold">
                    Next Question
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-red-400">😢 Incorrect!</p>
                  <p>Correct answer was: {currentDestination.city}</p>
                  <p>Trivia: {currentDestination.trivia[0]}</p>
                  <button onClick={() => loadNewQuestion(destinations, usedDestinations)}
                    className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-semibold">
                    Play Again
                  </button>
                </div>
              )}
            </motion.div>
          )}

          <motion.div 
            className="mt-6 p-4 rounded-lg bg-gray-800 text-white text-lg font-semibold shadow-lg border border-gray-600"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-green-400">✅ Score: {correct}</p>
            <p className="text-red-400">❌ Incorrect: {incorrect}</p>
          </motion.div>
        </>
      ) : (
        <p className="text-lg">Loading question...</p>
      )}
    </div>
  );

};

export default LocationTrivia;
