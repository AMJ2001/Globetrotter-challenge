import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const InviteProfile: React.FC = () => {
  const location = useLocation();
  const [inviter, setInviter] = useState<{ name: string; favourite: string; score: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (window.location.pathname === "/invite") {
      fetch(`http://localhost:5000/api/profile/?code=${params.get("code")}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error)  { throw new Error(data.error); }
          setInviter(data);
          localStorage.setItem('targetScore', data.score || 0);
        })
        .catch((err) => setError(err.message));
    }
  }, [location]);

  return (
    <div className="p-4 rounded-lg bg-gray-700 text-white shadow-md text-center">
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : inviter ? (
        <>
          <p className="text-xl font-bold">You were invited by {inviter.name} 🎉</p>
          <p className="text-gray-300">Favourite Place: {inviter.favourite || "None"}</p>
          <p className="text-yellow-400 font-semibold">Score: {inviter.score || 0}</p>
        </>
      ) : (
        <p>Loading inviter's profile...</p>
      )}

      <button
        onClick={() => window.location.href = "/"}
        className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all rounded-lg font-semibold shadow-lg">
        Start Playing 🚀
      </button>
    </div>
  );
};

export default InviteProfile;