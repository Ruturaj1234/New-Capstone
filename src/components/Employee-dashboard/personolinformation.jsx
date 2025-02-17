import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUserAlt, FaRegBuilding, FaMapMarkerAlt, FaBirthdayCake, FaUniversity } from "react-icons/fa";
import Sidebar from "./Sidebar";

const PersonalInformation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost/login-backend/get_user_info.php");
        const data = await response.json();
        if (data.success) {
          setPersonalInfo(data.employee);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  if (!personalInfo) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <img
                  src="https://www.saisamarthpolytech.com/images/logo.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
                >
                  <FaBars className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {personalInfo.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name}</h1>
                <p className="text-sm text-gray-500">Employee Profile</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm flex-1">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "personal"
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaUserAlt className="inline-block mr-2" />
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab("bank")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "bank"
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaRegBuilding className="inline-block mr-2" />
                  Bank Information
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1">
              {activeTab === "personal" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaUserAlt className="text-orange-500" />
                      <span className="font-medium">Full Name</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaBirthdayCake className="text-orange-500" />
                      <span className="font-medium">Age</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.age}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span className="font-medium">Address</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.address}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaUniversity className="text-orange-500" />
                      <span className="font-medium">Account Number</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.account_number}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaRegBuilding className="text-orange-500" />
                      <span className="font-medium">IFSC Code</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.ifsc_code}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;