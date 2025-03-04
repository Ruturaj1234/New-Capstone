import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react"; // Modern icons for buttons
import { FaUsers, FaTasks, FaEnvelope, FaClipboardList } from "react-icons/fa"; // Icons for cards
import EmployeeList from "./employee-list";
import AssignWork from "./assign-work";
import CurrentProjects from "./current-projects";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [showRequests, setShowRequests] = useState(false);
  const [showContent, setShowContent] = useState("employeeList");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = () => {
    fetch("http://localhost/login-backend/fetch_leave_requests.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLeaveRequests(data.data);
        } else {
          setMessage("Failed to fetch leave requests.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred while fetching leave requests.");
      });
  };

  const handleLeaveRequestAction = (id, status) => {
    fetch("http://localhost/login-backend/update_leave_status.php", {
      method: "POST",
      body: new URLSearchParams({
        id: id,
        status: status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("Leave request updated successfully.");
          fetchLeaveRequests();
        } else {
          setMessage("Failed to update leave request.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred while updating leave request.");
      });
  };

  const pendingLeaveRequests = leaveRequests.filter(
    (request) => request.status === "pending"
  );

  return (
    <div className="flex h-screen bg-gray-100 font-poppins">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/30 backdrop-blur-md p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
            >
              <FaBars size={24} />
            </button>
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto ml-4"
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
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
                View and manage all employees.
              </p>
            </div>

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
                Assign tasks to employees.
              </p>
            </div>

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
                Track ongoing projects.
              </p>
            </div>

            <div
              className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => setShowContent("requests")}
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FaEnvelope className="text-red-500 text-xl sm:text-2xl mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Requests
                </h2>
              </div>
              {pendingLeaveRequests.length > 0 ? (
                <p className="text-sm sm:text-base text-gray-500">
                  {pendingLeaveRequests.length} pending requests.
                </p>
              ) : (
                <p className="text-sm sm:text-base text-gray-500">
                  No requests at the moment.
                </p>
              )}
            </div>
          </div>

          {/* Render content based on selection */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            {showContent === "employeeList" && <EmployeeList />}
            {showContent === "assignWork" && <AssignWork />}
            {showContent === "workingProjects" && <CurrentProjects />}
            {showContent === "requests" && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave Requests</h2>
                {pendingLeaveRequests.length > 0 ? (
                  pendingLeaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="mb-6 border p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                          <button
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                            onClick={() =>
                              handleLeaveRequestAction(request.id, "approved")
                            }
                          >
                            <Check size={16} />
                            Approve
                          </button>
                          <button
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                            onClick={() =>
                              handleLeaveRequestAction(request.id, "declined")
                            }
                          >
                            <X size={16} />
                            Decline
                          </button>
                        </div>
                      </div>

                      <div className="mb-2">
                        <strong>Employee Name:</strong> {request.employee_name}
                      </div>
                      <div className="mb-2">
                        <strong>Subject:</strong> {request.subject}
                      </div>
                      <div className="mb-2">
                        <strong>Content:</strong> {request.content}
                      </div>
                      <div className="mb-2">
                        <strong>Start Date:</strong> {request.start_date}
                      </div>
                      <div className="mb-2">
                        <strong>End Date:</strong> {request.end_date}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> {request.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">
                    No pending requests.
                  </p>
                )}
              </div>
            )}

            {message && (
              <p className="mt-4 text-green-500 text-sm sm:text-base font-medium">
                {message}
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Popup Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave Requests</h2>

            {pendingLeaveRequests.length === 0 ? (
              <p className="text-center text-gray-600">No pending requests.</p>
            ) : (
              pendingLeaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="mb-6 border p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                      <button
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                        onClick={() =>
                          handleLeaveRequestAction(request.id, "approved")
                        }
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                        onClick={() =>
                          handleLeaveRequestAction(request.id, "declined")
                        }
                      >
                        <X size={16} />
                        Decline
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <strong>Employee Name:</strong> {request.employee_name}
                  </div>
                  <div className="mb-2">
                    <strong>Subject:</strong> {request.subject}
                  </div>
                  <div className="mb-2">
                    <strong>Content:</strong> {request.content}
                  </div>
                  <div className="mb-2">
                    <strong>Start Date:</strong> {request.start_date}
                  </div>
                  <div className="mb-2">
                    <strong>End Date:</strong> {request.end_date}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {request.status}
                  </div>
                </div>
              ))
            )}

            <button
              onClick={() => setShowRequests(false)}
              className="mt-4 w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center gap-1 text-sm font-semibold"
            >
              <X size={16} />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;