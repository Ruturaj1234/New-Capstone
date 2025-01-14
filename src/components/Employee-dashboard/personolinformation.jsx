import React from "react";
import { useNavigate } from "react-router-dom"; // Updated to useNavigate
import { FaArrowLeft } from "react-icons/fa";

const PersonalInformation = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Sample personal information
  const personalInfo = {
    name: "John Doe",
    address: "1234 Elm Street, Springfield, USA",
    mobileNumber: "+1 (555) 123-4567",
    accountNumber: "123456789012",
    ifscCode: "ABC123456",
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <header className="flex items-center mb-6">
        <button
          onClick={handleBackClick}
          className="text-gray-700 mr-4 hover:text-orange-600 transition duration-200"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-orange-600">
          Personal Information
        </h1>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Personal Details
            </h2>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              <strong>Name:</strong> {personalInfo.name}
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              <strong>Address:</strong> {personalInfo.address}
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              <strong>Mobile Number:</strong> {personalInfo.mobileNumber}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bank Details
            </h2>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              <strong>Account Number:</strong> {personalInfo.accountNumber}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <strong>IFSC Code:</strong> {personalInfo.ifscCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;