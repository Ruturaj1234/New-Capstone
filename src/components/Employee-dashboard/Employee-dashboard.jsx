import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Adjust path as necessary
import { FaBars, FaSignOutAlt } from "react-icons/fa";

const EmployeeDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    window.location.href = "/login"; // Redirect to login page
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <button onClick={toggleSidebar} className="text-gray-700">
            <FaBars size={24} />
          </button>
          <div className="flex items-center flex-grow justify-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto mr-4"
            />
            <h1 className="text-lg font-bold text-orange-600">
        
            </h1>
          </div>
          <button onClick={handleLogoutClick} className="text-gray-700">
            <FaSignOutAlt size={24} />
          </button>
        </header>

        {/* Welcome Section */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-orange-600 mb-4">
              Welcome to Sai Samarth Polytech
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Manage your tasks and view your assignments efficiently. Explore
              the sidebar for more options.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={confirmLogout}
                className="bg-orange-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;