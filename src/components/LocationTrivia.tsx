import React, { useState } from "react";
import { motion } from "framer-motion";

const LocationTrivia = () => {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState({
    clue: "This city is known as the Big Apple.",
    options: ["Los Angeles", "New York", "Chicago", "San Francisco"],
    answer: "New York",
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === question.answer) {
      setScore(score + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
    }, 1000);
  };

  return (
      <div className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Guess the Location!</h1>
        <p className="text-lg mb-4">{question.clue}</p>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              className={`p-3 rounded-lg text-lg transition-all duration-300 ${
                selected === option
                  ? feedback === "correct"
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-gray-800 hover:bg-gray-600"
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </motion.button>
          ))}
        </div>
        <p className="mt-4">Score: {score}</p>
      </div>
  );
};

export default LocationTrivia;
