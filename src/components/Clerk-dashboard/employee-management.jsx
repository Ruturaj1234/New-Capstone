import React, { useState, useEffect } from "react";
import { FaUsers, FaTasks, FaEnvelope, FaClipboardList } from "react-icons/fa";
import EmployeeList from "./employee-list"; // Import the EmployeeList component
import AssignWork from "./assign-work"; // Import the AssignWork component
import CurrentProjects from "./current-projects"; // Import the CurrentProjects component
import Sidebar from "./Sidebar"; // Import Sidebar component
import { FaBars } from "react-icons/fa";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showContent, setShowContent] = useState("employeeList");
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto mr-4"
            />
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden transition-colors duration-200"
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Grid for Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {/* Employee List Section */}
            <div
              className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => setShowContent("employeeList")}
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FaUsers className="text-blue-500 text-xl sm:text-2xl mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Employee List
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-500">
                View and manage all employees in the system.
              </p>
            </div>

            {/* Assign Work Section */}
            <div
              className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => setShowContent("assignWork")}
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FaTasks className="text-green-500 text-xl sm:text-2xl mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Assign Work
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-500">
                Assign tasks and projects to employees.
              </p>
            </div>

            {/* Currently Working Projects Section */}
            <div
              className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => setShowContent("workingProjects")}
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FaClipboardList className="text-purple-500 text-xl sm:text-2xl mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Current Projects
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-500">
                Track ongoing projects and their progress.
              </p>
            </div>

            {/* Requests Section */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <FaEnvelope className="text-red-500 text-xl sm:text-2xl mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Requests
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-500">
                No requests at the moment.
              </p>
            </div>
          </div>

          {/* Render content based on the selected section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
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

            {message && (
              <p className="mt-4 text-green-500 text-sm sm:text-base font-medium">
                {message}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeManagement;
