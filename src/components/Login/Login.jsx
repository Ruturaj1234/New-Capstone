/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost/login-backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network error");
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        setMessage(data.message || "Login successful!");
        const routes = {
          owner: "/owner-dashboard",
          employee: "/employee-dashboard",
          clerk: "/clerk-dashboard",
        };
        navigate(routes[data.role] || "/");
      } else {
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 p-6 overflow-hidden">
      {/* Moving Background Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        <div className="flex flex-col items-center gap-2"> {/* Reduced gap for tighter spacing */}
          <div className="text-white text-6xl font-bold uppercase tracking-wider animate-move-right-to-left hover:animate-move-right-to-left-slow pointer-events-auto whitespace-nowrap">
            Saisamarth Polytech
          </div>
          <div className="w-[600px] h-1 bg-white/70"></div> {/* Thin, visible line */}
          <div className="text-white text-6xl font-bold uppercase tracking-wider animate-move-left-to-right hover:animate-move-left-to-right-slow pointer-events-auto whitespace-nowrap">
            Saisamarth Polytech
          </div>
        </div>
      </div>

      {/* White Glassmorphism Card */}
      <div className="relative bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-white/40 transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://www.saisamarthpolytech.com/images/logo.png"
            alt="Sai Samarth Polytech"
            className="h-14 w-auto transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4 tracking-wide">

        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field with Floating Label */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-white/50 text-gray-900 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all duration-300 peer"
            />
            <label
              className={`absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 peer-focus:-top-0 peer-focus:text-sm peer-focus:text-orange-600 peer-focus:bg-white/50 peer-focus:px-1 ${
                username ? "-top-0 text-sm text-orange-600 bg-white/50 px-1" : ""
              }`}
            >
              Username
            </label>
          </div>

          {/* Password Field with Floating Label */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-3 rounded-lg border-none bg-white/50 text-gray-900 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all duration-300 peer"
            />
            <label
              className={`absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 peer-focus:-top-0 peer-focus:text-sm peer-focus:text-orange-600 peer-focus:bg-white/50 peer-focus:px-1 ${
                password ? "-top-0 text-sm text-orange-600 bg-white/50 px-1" : ""
              }`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors duration-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Legal Links */}
        <div className="mt-6 text-center text-sm text-gray-700">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
              Terms
            </Link>{" "}
            &{" "}
            <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* CSS for Moving Text with Dynamic Speed */}
      <style jsx>{`
        @keyframes move-right-to-left {
          0% { transform: translateX(100vw); }
          20% { transform: translateX(50vw); } /* Slow entry */
          80% { transform: translateX(-50vw); } /* Fast middle */
          100% { transform: translateX(-100vw); } /* Slow exit */
        }
        @keyframes move-left-to-right {
          0% { transform: translateX(-100vw); }
          20% { transform: translateX(-50vw); } /* Slow entry */
          80% { transform: translateX(50vw); } /* Fast middle */
          100% { transform: translateX(100vw); } /* Slow exit */
        }
        @keyframes move-right-to-left-slow {
          0% { transform: translateX(100vw); }
          20% { transform: translateX(50vw); }
          80% { transform: translateX(-50vw); }
          100% { transform: translateX(-100vw); }
        }
        @keyframes move-left-to-right-slow {
          0% { transform: translateX(-100vw); }
          20% { transform: translateX(-50vw); }
          80% { transform: translateX(50vw); }
          100% { transform: translateX(100vw); }
        }
        .animate-move-right-to-left {
          animation: move-right-to-left 10s ease infinite;
        }
        .animate-move-left-to-right {
          animation: move-left-to-right 10s ease infinite;
        }
        .hover\:animate-move-right-to-left-slow:hover {
          animation: move-right-to-left-slow 20s ease infinite;
        }
        .hover\:animate-move-left-to-right-slow:hover {
          animation: move-left-to-right-slow 20s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;