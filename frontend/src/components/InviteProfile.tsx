import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const InviteProfile: React.FC = () => {
  const location = useLocation();
  const [inviter, setInviter] = useState<{ name: string; favourite: string; score: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviterId = params.get("inviterId");

    if (inviterId) {
      fetch(`http://localhost:5000/api/user/profile/${inviterId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setInviter(data);
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
          <p className="text-gray-300">Favourite: {inviter.favourite || "None"}</p>
          <p className="text-yellow-400 font-semibold">Score: {inviter.score}</p>
        </>
      ) : (
        <p>Loading inviter's profile...</p>
      )}
    </div>
  );
};

export default InviteProfile;
