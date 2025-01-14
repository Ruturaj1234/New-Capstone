// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Menu</h2>
        <button onClick={onClose} className="text-gray-700">
          X
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dummy-quotation"
              className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Dummy Quotation
            </Link>
          </li>
          <li>
            <Link
              to="/client-management"
              className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Client Management
            </Link>
          </li>
          <li>
            <Link
              to="/employee-management"
              className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Employee Management
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;