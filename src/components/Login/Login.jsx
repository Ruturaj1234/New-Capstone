/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Added FaEye and FaEyeSlash

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For password visibility toggle
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

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
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 px-4 lg:px-8 animate-gradient bg-noise font-inter">
      <div className="bg-white/30 p-6 md:p-10 lg:p-12 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl transform transition duration-500 hover:scale-105 border border-white/20 animate-fade-in-up">
        {/* Company Branding */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-500 tracking-wider font-poppins">
            Saisamarth Polytech
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-2 font-inter">
            Empowering Innovation Through Technology
          </p>
        </div>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-center text-gray-700 mb-6 font-poppins">
          Welcome Back! Please Log In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field with Floating Label */}
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              aria-label="Username"
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm transition duration-300 hover:border-orange-400 peer text-base lg:text-lg font-inter"
            />
            <label className="absolute left-10 top-3 text-gray-400 transition-all duration-300 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-orange-500 bg-white px-1 peer-focus:px-2 font-inter">
              Username
            </label>
            <FaUser className="absolute left-3 top-4 text-gray-400 text-lg lg:text-xl" />
          </div>

          {/* Password Field with Toggle and Floating Label */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm transition duration-300 hover:border-orange-400 peer text-base lg:text-lg font-inter"
            />
            <label className="absolute left-10 top-3 text-gray-400 transition-all duration-300 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-orange-500 bg-white px-1 peer-focus:px-2 font-inter">
              Password
            </label>
            <FaLock className="absolute left-3 top-4 text-gray-400 text-lg lg:text-xl" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 text-lg lg:text-xl"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 lg:py-4 text-white font-semibold rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base lg:text-lg font-inter"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer with Legal Text */}
        <div className="mt-6 text-center text-sm lg:text-base text-gray-600 font-inter">
          By logging in, you agree to our{" "}
          <Link href="/terms" className="text-orange-500 hover:text-orange-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-orange-500 hover:text-orange-600"
          >
            Privacy Policy
          </Link>
          .
        </div>

        {/* Error/Success Message */}
        {message && (
          <p className="mt-4 text-center text-red-500 font-medium text-base lg:text-lg font-inter">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;