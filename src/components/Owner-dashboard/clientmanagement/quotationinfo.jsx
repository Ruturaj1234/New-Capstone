/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Sidebar from "../Sidebar"; // Ensure Sidebar component is imported correctly
import {
  FileText,
  Receipt,
  Image,
  Download,
  Calendar,
  Clock,
  ArrowLeft, // Import the ArrowLeft icon for the back button
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const QuotationInfo = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownload = (type) => {
    console.log(`Downloading ${type}`);
  };

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
          Document Management System
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Manage and download your documents, including quotations, bills, and
          media files, all in one place. Stay organized and keep track of your
          important files effortlessly.
        </p>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="border-b border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Download Options
            </h2>
            {/* Date and Time Section */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-6 h-6" />
                <span className="font-medium">{currentDate}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-6 h-6" />
                <span className="font-medium">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Download Options Grid */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Quotation Download */}
              <button
                onClick={() => handleDownload("quotation")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="p-4 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quotation PDF
                  </h3>
                  <p className="text-sm text-gray-500">
                    Download your quotation as a PDF file.
                  </p>
                </div>
                <Download className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
              </button>

              {/* Bill Download */}
              <button
                onClick={() => handleDownload("bill")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Receipt className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bill PDF
                  </h3>
                  <p className="text-sm text-gray-500">
                    Download the bill for your records.
                  </p>
                </div>
                <Download className="w-6 h-6 text-gray-400 group-hover:text-green-500" />
              </button>

              {/* Media Download */}
              <div className="col-span-full flex justify-center">
                <button
                  onClick={() => handleDownload("media")}
                  className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-purple-500 hover:bg-purple-50 transition-all group w-full sm:w-auto"
                >
                  <div className="p-4 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Image className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Media Files
                    </h3>
                    <p className="text-sm text-gray-500">
                      View and download media files related to the project.
                    </p>
                  </div>
                  <Download className="w-6 h-6 text-gray-400 group-hover:text-purple-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuotationInfo;