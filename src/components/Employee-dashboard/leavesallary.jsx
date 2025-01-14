import React, { useState } from "react";
import {
  FaBars,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";
import Sidebar from "./Sidebar";

const SalaryLeaveManagement = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

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

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            {/* Section Title */}
            <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
              Salary Slip & Leave Management
            </h1>

            {/* Back Button */}
            {activeSection && (
              <button
                className="flex items-center gap-2 text-gray-700 font-semibold mb-4 hover:text-orange-600"
                onClick={() => setActiveSection(null)}
              >
                <FaArrowLeft className="text-xl" />
                Back
              </button>
            )}

            {/* Main Menu: Two Boxes */}
            {!activeSection && (
              <div className="flex flex-wrap justify-center gap-8 p-6">
                <div
                  className="w-52 h-52 bg-gradient-to-r from-orange-300 to-orange-400 flex flex-col items-center justify-center rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer hover:bg-orange-500"
                  onClick={() => handleSectionClick("leave")}
                >
                  <FaCalendarAlt className="text-white text-5xl mb-3" />
                  <p className="text-lg font-semibold text-white">
                    Leave Management
                  </p>
                </div>
                <div
                  className="w-52 h-52 bg-gradient-to-r from-orange-300 to-orange-400 flex flex-col items-center justify-center rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer hover:bg-orange-500"
                  onClick={() => handleSectionClick("salary")}
                >
                  <FaFileInvoiceDollar className="text-white text-5xl mb-3" />
                  <p className="text-lg font-semibold text-white">
                    Salary Slip
                  </p>
                </div>
              </div>
            )}

            {/* Leave Management Content */}
            {activeSection === "leave" && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Leave Management
                </h2>
                <p className="text-gray-600">
                  Manage your leaves, view leave history, and apply for new
                  leaves.
                </p>
              </div>
            )}

            {/* Salary Slip Content */}
            {activeSection === "salary" && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Salary Slip
                </h2>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <label
                    htmlFor="month"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Select Month:
                  </label>
                  <select
                    id="month"
                    className="bg-white border border-gray-300 rounded-lg p-2"
                  >
                    <option>Select the month</option>
                    <option>January-2025</option>
                    <option>February-2025</option>
                    <option>March-2025</option>
                    <option>April-2025</option>
                    <option>May-2025</option>
                    <option>June-2025</option>
                    <option>July-2025</option>
                    <option>August-2025</option>
                    <option>September-2025</option>
                    <option>October-2025</option>
                    <option>November-2025</option>
                    <option>December-2025</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                    Search
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalaryLeaveManagement;