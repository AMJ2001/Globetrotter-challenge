import { motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Game from "./components/LocationTrivia";
import UserComponent from "./components/User";
import InviteProfile from "./components/InviteProfile";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUserData] = useState<Record<string, string> | null>(null);

  const handleChallenge = async () => {
    let decodedData;
    const localData = localStorage.getItem("userDetails");
    if (localData) {
      decodedData = jwtDecode(localData) as Record<string, string>;
      setUserData(decodedData);
    } else if (!user) {
      window.location.href = "/user";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviterId: user?.id || decodedData?.id }),
      });
  
      const data = await response.json();
      if (data.inviteLink) {
        const text = encodeURIComponent(`Join me in the Globetrotter Challenge! 🌍 ${data.inviteLink}`);
        window.open(`https://wa.me/?text=${text}`, "_blank");
      }
    } catch (error) {
      console.error("Error generating invite link:", error);
    }
  };
  
  return (
    <Router>
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

          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/user" element={<UserComponent setUserData={setUserData} />} />
            <Route path="/invite" element={<InviteProfile />} />
          </Routes>

          <button 
            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-700 text-white"
            onClick={handleChallenge}>
            Challenge a Friend
          </button>
        </header>
      </div>
    </Router>
  );
}

export default App;