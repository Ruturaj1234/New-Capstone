import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const EmployeeDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto mr-4"
            />
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Welcome Section */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-orange-600 mb-4">
              Welcome to Sai Samarth Polytech
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
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