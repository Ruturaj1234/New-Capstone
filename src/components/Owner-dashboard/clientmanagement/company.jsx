/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar"; // Ensure Sidebar component is correctly imported
import { FaBars } from "react-icons/fa";

const Company = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const companyNames = ["TechCorp", "InnoSolutions", "FutureWorks", "AlphaTech"];

  // Component for displaying company cards
  const CompanyCards = () => (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-wide text-center">
        Trusted by Leading Companies
      </h2>
      <p className="text-lg text-gray-600 mb-6 text-center">
        We take pride in partnering with some of the most innovative and forward-thinking companies across industries.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {companyNames.map((company, index) => (
          <Link
            to="/list"
            key={index}
            className="bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-200 rounded-xl shadow-md p-6 hover:shadow-2xl hover:scale-105 transform transition-transform duration-300 ease-in-out"
          >
            <h3 className="text-lg font-semibold text-gray-800 text-center">{company}</h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Industry Leader
            </p>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
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
            <CompanyCards />
        </main>
      </div>
    </div>
  );
};

export default Company;
