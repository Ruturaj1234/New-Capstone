// EmployeeManagement.js
import React, { useState } from "react";
import { FaUsers, FaTasks, FaEnvelope } from "react-icons/fa";
import EmployeeList from "./employee-list"; // Import the EmployeeList component
import AssignWork from "./assign-work"; // Import the AssignWork component

const EmployeeManagement = () => {
  const [employees] = useState([
    {
      id: 1,
      username: "john_doe",
      personalDetails: { name: "John Doe", age: 30, address: "123 Street" },
      bankDetails: { accountNumber: "1234567890", ifsc: "ABC1234" },
      salary: { basic: 30000, da: 5000, hra: 8000, maintenance: 2000 },
      projects: ["Project A", "Project B"],
    },
    {
      id: 2,
      username: "jane_smith",
      personalDetails: { name: "Jane Smith", age: 28, address: "456 Avenue" },
      bankDetails: { accountNumber: "9876543210", ifsc: "XYZ5678" },
      salary: { basic: 35000, da: 6000, hra: 9000, maintenance: 3000 },
      projects: ["Project X", "Project Y"],
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showContent, setShowContent] = useState("employeeList");
  const [message, setMessage] = useState("");

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Employee Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
        {/* Employee List Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <FaUsers className="text-blue-500 text-2xl mr-2" />
            <h2 className="text-xl font-semibold">Employee List</h2>
          </div>
          <button
            onClick={() => setShowContent("employeeList")}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
          >
            Show Employee List
          </button>
        </div>

        {/* Assign Work Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <FaTasks className="text-green-500 text-2xl mr-2" />
            <h2 className="text-xl font-semibold">Assign Work</h2>
          </div>
          <button
            onClick={() => setShowContent("assignWork")}
            className="w-full bg-green-600 text-white px-4 py-2 rounded"
          >
            Assign Work
          </button>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <FaEnvelope className="text-red-500 text-2xl mr-2" />
            <h2 className="text-xl font-semibold">Requests</h2>
          </div>
          <p className="text-gray-500">No requests at the moment.</p>
        </div>
      </div>

      {/* Render Employee List or Assign Work content */}
      {showContent === "employeeList" && (
        <EmployeeList
          employees={employees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}

      {showContent === "assignWork" && (
        <AssignWork
          employees={employees}
          selectedEmployee={selectedEmployee}
          setMessage={setMessage}
        />
      )}

      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
};

export default EmployeeManagement;