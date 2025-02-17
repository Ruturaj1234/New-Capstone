/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import { FaBars } from "react-icons/fa";

const Company = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [companyNames, setCompanyNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    fetch("http://localhost/login-backend/Owner-management/companies.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setCompanyNames(data);
        } else {
          setCompanyNames(["No companies found"]);
        }
      })
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  // Filter companies based on search query
  const filteredCompanies = companyNames.filter((company) =>
    company.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="flex items-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto mr-4"
            />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Company Cards */}
        <main className="flex-1 p-6 overflow-y-auto">
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Trusted by Leading Companies
            </h2>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Click on a company to view its projects.
            </p>
            {/* Search Bar */}
            <div className="mb-6 flex justify-center">
              <input
                type="text"
                placeholder="Search for companies..."
                className="px-4 py-2 w-full max-w-md rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <Link
                    to={`/list/${encodeURIComponent(company)}`}
                    key={index}
                    className="bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-200 rounded-xl shadow-md p-6 hover:shadow-2xl hover:scale-105 transform transition-transform duration-300 ease-in-out text-center"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {company}
                    </h3>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No companies found.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Company;