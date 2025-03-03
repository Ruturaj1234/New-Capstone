/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Adjust path as necessary
import { FaBars } from "react-icons/fa";

const ClerkDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none lg:hidden mr-4"
            >
              <FaBars size={24} />
            </button>
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto"
            />
          </div>
        </header>

        {/* Welcome Section */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-orange-600 mb-4">
              Welcome to Sai Samarth Polytech
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We are dedicated to providing cutting-edge polymer technology
              solutions tailored to meet the needs of various industries.
              Explore the sidebar to manage your tasks effectively.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClerkDashboard;