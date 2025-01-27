/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Sidebar from "../Sidebar"; // Ensure Sidebar component is imported correctly
import { ArrowLeft } from "lucide-react"; // Import the ArrowLeft icon for the back button

const Quotationlist = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const quotes = [
    { title: "ABC" },
    { title: "XYZ" },
  ];

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 focus:outline-none"
        >
          <ArrowLeft className="w-6 h-6" /> {/* Back icon */}
          <span className="text-lg font-medium">Back</span>
        </button>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none mb-6"
        ></button>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Project Quotations
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Explore and manage detailed quotations for various projects. Click on a
          project to view its full details, track progress, and take necessary
          actions to ensure seamless management.
        </p>

        {/* Quotations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {quotes.map((item, index) => (
            <Link
              to={`/info`}
              key={index}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer group"
              onClick={() => setIsMobileMenuOpen(false)} // Close sidebar when a link is clicked
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                Click to view detailed information about this project quotation.
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Quotationlist;