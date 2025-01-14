import React, { useState, useEffect } from "react";
import { FaUsers, FaTasks, FaEnvelope, FaClipboardList } from "react-icons/fa";
import EmployeeList from "./employee-list"; // Import the EmployeeList component
import AssignWork from "./assign-work"; // Import the AssignWork component
import CurrentProjects from "./current-projects"; // Import the CurrentProjects component

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showContent, setShowContent] = useState("employeeList");
  const [message, setMessage] = useState("");

  // Fetch employee names from the backend
  useEffect(() => {
    fetch("http://localhost/login-backend/fetchemployees.php") // Update the URL if necessary
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        return response.json();
      })
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Employee Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-4">
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

        {/* Currently Working Projects Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-purple-500 text-2xl mr-2" />
            <h2 className="text-xl font-semibold">Currently Working Projects</h2>
          </div>
          <button
            onClick={() => setShowContent("workingProjects")}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded"
          >
            Show Working Projects
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

      {/* Render content based on the selected section */}
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

      {showContent === "workingProjects" && <CurrentProjects />}

      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
};

export default EmployeeManagement;