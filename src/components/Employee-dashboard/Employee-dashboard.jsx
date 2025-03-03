/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const EmployeeDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
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
        <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-orange-500 mb-4">
              Welcome to Sai Samarth Polytech
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your tasks and view your assignments efficiently. Explore
              the sidebar for more options.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;