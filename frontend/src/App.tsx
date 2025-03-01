import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Game from './components/LocationTrivia';
import UserComponent from './components/User';
import InviteProfile from './components/InviteProfile';
import { jwtDecode } from 'jwt-decode';
import html2canvas from 'html2canvas';
import PopUp from './components/Popup';

function App() {
  const [user, setUserData] = useState<Record<string, string> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleChallenge = async () => {
    let decodedData;
    const localData = localStorage.getItem('userDetails');

    if (localData) {
      decodedData = jwtDecode(localData) as Record<string, string>;
      setUserData(decodedData);
    } else if (!user) {
      window.location.href = '/user';
      return;
    }

    // Capture UI elements as an image
    const element = document.querySelector('.App-header');
    const canvas = await html2canvas(element as HTMLElement);
    const imageData = canvas.toDataURL('image/png');

    try {
      const response = await fetch('http://localhost:5000/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localData}`,
        },
        body: JSON.stringify({ inviterId: user?.id || decodedData?.id, image: imageData }),
      });

      const data = await response.json();
      if (data.inviteLink) {
        setInviteLink(data.inviteLink);
        setImageUrl(data.imageUrl);
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error generating invite link:', error);
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
              transition={{ duration: 0.8, ease: 'easeInOut', repeat: 2, repeatType: 'reverse' }}>
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

        <PopUp
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          inviteLink={inviteLink}
          imageUrl={imageUrl}
        />
      </div>
    </Router>
  );
}

export default App;
