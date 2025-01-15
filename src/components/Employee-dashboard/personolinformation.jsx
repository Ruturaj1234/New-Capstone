import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars, FaUserAlt, FaRegBuilding } from "react-icons/fa";
import Sidebar from "./Sidebar";

const PersonalInformation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user information
    fetch("http://localhost/login-backend/get_user_info.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserInfo(data.user);
        } else {
          setError(data.message || "Failed to fetch user information");
        }
      })
      .catch((error) => {
        setError("An error occurred while fetching user information");
      });
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white p-6 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-12 w-auto mr-4"
            />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Welcome Message */}
        <section className="bg-white p-8 shadow-lg rounded-xl mx-6 my-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            Hello {userInfo.username}!
          </h1>
          <p className="text-lg text-gray-600">We're excited to have you as part of the team.</p>
        </section>

        {/* Profile Header Section */}
        <section className="bg-white p-8 shadow-lg rounded-xl mx-6 my-4 flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white text-4xl font-semibold cursor-pointer">
            {userInfo.username.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Hello {userInfo.username}</h2>
            <p className="text-lg text-gray-600">Employee Profile</p>
            <p className="text-md text-gray-500">{userInfo.email}</p>
          </div>
        </section>

        {/* Tab Section */}
        <main className="flex-1 flex flex-col items-center p-6">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
            {/* Tab Navigation */}
            <div className="flex mb-6 border-b-2 border-gray-200">
              <button
                className={`flex-1 text-xl font-semibold py-4 rounded-l-2xl transition-all duration-300 ${
                  activeTab === "personal"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                <FaUserAlt className="inline mr-2" />
                Personal Info
              </button>
              <button
                className={`flex-1 text-xl font-semibold py-4 rounded-r-2xl transition-all duration-300 ${
                  activeTab === "bank"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("bank")}
              >
                <FaRegBuilding className="inline mr-2" />
                Bank Details
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "personal" ? (
                <div className="transition-opacity duration-500">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Details</h2>
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold text-gray-900">Name:</strong> {userInfo.username}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold text-gray-900">Age:</strong> {userInfo.age}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold text-gray-900">Address:</strong> {userInfo.address}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold text-gray-900">Mobile Number:</strong> {userInfo.mobile_number}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="transition-opacity duration-500">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bank Details</h2>
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold text-gray-900">Account Number:</strong> {userInfo.account_number}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold text-gray-900">IFSC Code:</strong> {userInfo.ifsc_code}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalInformation;
