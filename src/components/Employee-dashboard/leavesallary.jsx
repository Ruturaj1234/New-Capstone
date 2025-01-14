// SalaryLeaveManagement.jsx
import React, { useState } from "react";
import { FaFileInvoiceDollar, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";

const SalaryLeaveManagement = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
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
          <div className="flex flex-wrap justify-center gap-6">
            <div
              className="w-40 h-40 bg-orange-100 flex flex-col items-center justify-center rounded-lg shadow cursor-pointer hover:bg-orange-200 transition"
              onClick={() => handleSectionClick("leave")}
            >
              <FaCalendarAlt className="text-orange-600 text-4xl mb-2" />
              <p className="text-lg font-semibold text-gray-700">
                Leave Management
              </p>
            </div>
            <div
              className="w-40 h-40 bg-orange-100 flex flex-col items-center justify-center rounded-lg shadow cursor-pointer hover:bg-orange-200 transition"
              onClick={() => handleSectionClick("salary")}
            >
              <FaFileInvoiceDollar className="text-orange-600 text-4xl mb-2" />
              <p className="text-lg font-semibold text-gray-700">Salary Slip</p>
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
              Manage your leaves, view leave history, and apply for new leaves.
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
              <label htmlFor="month" className="text-lg font-semibold text-gray-700">
                Select Month:
              </label>
              <select
                id="month"
                className="bg-white border border-gray-300 rounded-lg p-2"
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
              <label htmlFor="year" className="text-lg font-semibold text-gray-700">
                Select Year:
              </label>
              <select
                id="year"
                className="bg-white border border-gray-300 rounded-lg p-2"
              >
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
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
    </div>
  );
};

export default SalaryLeaveManagement;
 