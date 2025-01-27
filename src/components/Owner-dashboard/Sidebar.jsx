/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Users, DollarSign, Briefcase, LogOut } from "lucide-react";

// Constants
const MENU_ITEMS = [
  {
    icon: Users,
    label: "Manage Users",
    path: "/manageuser",
  },
  {
    icon: DollarSign,
    label: "Revenue Management",
    path: "/revenue",
  },
  {
    icon: Briefcase,
    label: "Client Management",
    path: "/company",
  },
];

// Subcomponents
const SidebarButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-4 py-3 mb-2 text-gray-100 hover:bg-gradient-to-r from-orange-500 to-orange-700 rounded-lg transition-transform transform hover:scale-105 duration-200 shadow-lg"
  >
    <Icon className="h-5 w-5 mr-3 text-white" />
    <span>{label}</span>
  </button>
);

const SidebarHeader = ({ onClose }) => (
  <div className="p-4 border-b border-orange-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">
        Owner
      </h2>
      <button
        onClick={onClose}
        className="lg:hidden text-white hover:text-gray-200"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  </div>
);

const SidebarContent = ({ onItemClick, onLogout }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.onClick) {
      item.onClick();
    }
    onItemClick();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-600 to-orange-800 w-64 min-h-screen shadow-2xl rounded-tr-xl rounded-br-xl">
      <SidebarHeader onClose={onItemClick} />
      <nav className="flex-1 px-4 py-6">
        {MENU_ITEMS.map((item, index) => (
          <SidebarButton
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </nav>
      <div className="p-4 border-t border-orange-500">
        <SidebarButton
          icon={LogOut}
          label="Logout"
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

// Main component
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out bg-gradient-to-br from-orange-600 to-orange-800 shadow-2xl rounded-tr-xl rounded-br-xl">
            <SidebarContent
              onItemClick={closeMobileMenu}
              onLogout={handleLogoutClick}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <SidebarContent
          onItemClick={() => {}}
          onLogout={handleLogoutClick}
        />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
