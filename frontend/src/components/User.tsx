import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

interface UserProps {
  setUserData: (user: Record<string, string>) => void;
}

const UserComponent: React.FC<UserProps> = ({ setUserData }) => {
  const [user, setUser] = useState<Record<string, string> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [favourite, setFavourite] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuth = async () => {
    const url = isLoginMode
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/register";

    const payload = isLoginMode
      ? { email, password }
      : { email, password, name, favourite };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('userDetails', data.token);
      const userData = jwtDecode(data.token) as Record<string, string>;
      setUser(userData);
      setUserData(userData);
      window.location.href = "/";
    } else {
      alert(data.error || "Authentication failed.");
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-700 text-white shadow-md text-center">
      {user ? (
        <p>Welcome, {user.name}! 🎉</p>
      ) : (
        <>
        <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                isLoginMode ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
              }`}
              onClick={() => {
                setIsLoginMode(true);
              }}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                !isLoginMode ? "bg-green-500 hover:bg-green-700" : "bg-gray-500"
              }`}
              onClick={() => {
                setIsLoginMode(false);
              }}
            >
              Register
            </button>
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>

          {!isLoginMode && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Favourite"
                  value={favourite}
                  onChange={(e) => setFavourite(e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
              </div>
            </>
          )}
          <div>
            <button className="px-4 py-2 rounded-lg"
              onClick={() => {
                handleAuth();
              }}
            >Submit</button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserComponent;