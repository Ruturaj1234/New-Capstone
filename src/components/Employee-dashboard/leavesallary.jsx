import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";
import Sidebar from "./Sidebar";

const SalaryLeaveManagement = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [leaveRequest, setLeaveRequest] = useState(null); // Store existing leave request
  const [isLoading, setIsLoading] = useState(true); // Loading state for checking leave request
  const [selectedYear, setSelectedYear] = useState("2025"); // Default Year
  const [selectedMonth, setSelectedMonth] = useState(""); // Selected month
  const [availableMonths, setAvailableMonths] = useState([]);
  const [salaryDetails, setSalaryDetails] = useState(null); // State for storing salary details

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    updateAvailableMonths(selectedYear);
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed
    const validMonths = monthsList.slice(0, currentMonth);
    setAvailableMonths(validMonths);
  }, []);

  // Fetch the current user's leave request when the component mounts
  useEffect(() => {
    const fetchLeaveRequest = async () => {
      try {
        const response = await fetch(
          "http://localhost/login-backend/check_leave_request.php"
        );
        const data = await response.json();

        if (data.success) {
          setLeaveRequest(data.data); // Store the leave request if it exists
        } else {
          setLeaveRequest(null); // No leave request exists
        }
      } catch (error) {
        console.error("Error fetching leave request:", error);
      } finally {
        setIsLoading(false); // Mark as loaded
      }
    };

    fetchLeaveRequest();
  }, []);

  const updateAvailableMonths = (year) => {
    if (year === "2025") {
      const currentMonth = new Date().getMonth(); // 0-based index
      setAvailableMonths(monthsList.slice(0, currentMonth + 1));
    } else {
      setAvailableMonths(monthsList);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch(
        "http://localhost/login-backend/leave_management.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();

      if (result.status === "success") {
        alert("Leave request submitted successfully.");
        setLeaveRequest(result.data); // Update leave request state with new request
        setActiveSection(null); // Go back to the main menu
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("An error occurred while submitting the request.");
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    updateAvailableMonths(year);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
  };

  const handleSearchClick = async () => {
    if (!selectedMonth) {
      alert("Please select a month.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/login-backend/salary_slip.php?month=${selectedMonth}`
      );
      const data = await response.json();

      if (data.success) {
        setSalaryDetails(data.data);
      } else {
        alert("No salary data found for the selected month.");
        setSalaryDetails(null);
      }
    } catch (error) {
      console.error("Error fetching salary details:", error);
      alert("An error occurred while fetching salary details.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching leave request
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none lg:hidden mr-4"
            >
              <FaBars size={24} />
            </button>
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto"
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
              Salary Slip & Leave Management
            </h1>

            {/* Back Button */}
            {activeSection === "leave" && (
              <button
                className="flex items-center gap-2 text-gray-700 font-semibold mb-4 hover:text-orange-600"
                onClick={() => setActiveSection(null)}
              >
                <FaArrowLeft className="text-xl" />
                Back
              </button>
            )}

            {/* Main Menu */}
            {!activeSection && (
              <div className="flex flex-wrap justify-center gap-8 p-6">
                <div
                  className="w-52 h-52 bg-gradient-to-r from-orange-300 to-orange-400 flex flex-col items-center justify-center rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer hover:bg-orange-500"
                  onClick={() => handleSectionClick("leave")}
                >
                  <FaCalendarAlt className="text-white text-5xl mb-3" />
                  <p className="text-lg font-semibold text-white">
                    Leave Management
                  </p>
                </div>
                <div
                  className="w-52 h-52 bg-gradient-to-r from-orange-300 to-orange-400 flex flex-col items-center justify-center rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer hover:bg-orange-500"
                  onClick={() => handleSectionClick("salary")}
                >
                  <FaFileInvoiceDollar className="text-white text-5xl mb-3" />
                  <p className="text-lg font-semibold text-white">
                    Salary Slip
                  </p>
                </div>
              </div>
            )}

            {/* Salary Slip Section */}
            {activeSection === "salary" && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Salary Slip
                </h2>
                <button
                  className="flex items-center gap-2 text-gray-700 font-semibold mb-4 hover:text-orange-600"
                  onClick={() => setActiveSection(null)}
                >
                  <FaArrowLeft className="text-xl" />
                  Back
                </button>
                {/* Year and Month Dropdowns */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <label className="text-lg font-semibold text-gray-700">
                    Year:
                  </label>
                  <select
                    className="bg-white border border-gray-300 rounded-lg p-2"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <label
                    htmlFor="month"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Select Month:
                  </label>
                  <select
                    id="month"
                    className="bg-white border border-gray-300 rounded-lg p-2"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    <option value="">Select the month</option>
                    {availableMonths.map((month) => (
                      <option key={month} value={`${month}-${selectedYear}`}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSearchClick}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                  >
                    Search
                  </button>
                </div>

                {/* Salary Details Table */}
                {salaryDetails && (
                  <div className="mt-6 overflow-x-auto">
                    <h3 className="text-xl font-bold text-gray-700 mb-3">
                      Salary Details for {selectedMonth}
                    </h3>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 px-4 py-2">
                            Basic Salary
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            HRA
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            DA
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Maintainance Allowance
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Net Salary
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Account Number
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            IFSC Code
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{salaryDetails.salary_basic}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{salaryDetails.salary_hra}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{salaryDetails.salary_da}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{salaryDetails.salary_maintenance}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{salaryDetails.total_salary}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {salaryDetails.account_number}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {salaryDetails.ifsc_code}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Leave Management Section */}
            {activeSection === "leave" && (
              <>
                {/* Display leave request details (always visible if request exists) */}
                {leaveRequest && leaveRequest.length > 0 && (
                  <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Leave Request Details
                    </h2>
                    <div className="overflow-x-auto pt-2">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border">Subject</th>
                            <th className="px-4 py-2 border">Content</th>
                            <th className="px-4 py-2 border">Start Date</th>
                            <th className="px-4 py-2 border">End Date</th>
                            <th className="px-4 py-2 border">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaveRequest.map((request) => (
                            <tr key={request.id}>
                              <td className="px-4 py-2 border">
                                {request.subject}
                              </td>
                              <td className="px-4 py-2 border">
                                {request.content}
                              </td>
                              <td className="px-4 py-2 border">
                                {request.start_date}
                              </td>
                              <td className="px-4 py-2 border">
                                {request.end_date}
                              </td>
                              <td className="px-4 py-2 border">
                                {request.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Always show the leave request form */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Leave Management
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below to submit a leave request.
                  </p>

                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Subject:
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        className="w-full border border-gray-300 p-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Content:
                      </label>
                      <textarea
                        name="content"
                        required
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        rows="5"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Start Date:
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        required
                        className="w-full border border-gray-300 p-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        End Date:
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        required
                        className="w-full border border-gray-300 p-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                      >
                        Submit Leave Request
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalaryLeaveManagement;