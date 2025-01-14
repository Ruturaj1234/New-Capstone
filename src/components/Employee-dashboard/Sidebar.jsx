import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transition-transform duration-300 ${
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
            <Link to="/personolinformation" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
              Personal Information
            </Link>
          </li>
          <li>
            <Link to="/assignedproject" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
              Assigned Projects
            </Link>
          </li>
          <li>
            <Link to="/leavesalary" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
              Salary Slip and Leave Management
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;


