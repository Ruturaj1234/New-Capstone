/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // For modern icons

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/login-backend/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        switch (data.role) {
          case "owner":
            navigate("/owner-dashboard");
            break;
          case "employee":
            navigate("/employee-dashboard");
            break;
          case "clerk":
            navigate("/clerk-dashboard");
            break;
          default:
            setMessage("Unknown role. Please contact support.");
        }
      } else {
        setMessage("Invalid username or password. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg transform transition duration-500 hover:scale-105">
        {/* Company Branding */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-500 tracking-wider">
            Saisamarth Polytech
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Empowering Innovation Through Technology
          </p>
        </div>

        <h2 className="text-lg sm:text-xl font-medium text-center text-gray-700 mb-6">
          Welcome Back! Please Log In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm transition duration-300"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg transition duration-300"
          >
            Log In
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;