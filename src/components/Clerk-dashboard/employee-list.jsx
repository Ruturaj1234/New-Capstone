import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // For the search icon

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [isSalaryFormVisible, setIsSalaryFormVisible] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState({
    salary_basic: "",
    salary_da: "",
    salary_hra: "",
    salary_maintenance: "",
  });
  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost/login-backend/fetchemployeedetails.php")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
          setFilteredEmployees(data); // Initially show all employees
        } else {
          setError("Invalid data format received from the server.");
        }
      })
      .catch((error) => {
        setError("Error fetching employee data. Please try again later.");
        console.error("Error fetching employee data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter employees based on search query
  useEffect(() => {
    const filtered = employees.filter((employee) =>
      [employee.id.toString(), employee.name.toLowerCase(), employee.email?.toLowerCase() || ""]
        .some((field) => field.includes(searchQuery.toLowerCase()))
    );
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  const fetchEmployeeDetails = (employeeId) => {
    setLoading(true);
    fetch("http://localhost/login-backend/fetchemployeedetails.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: employeeId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data[0]) {
          setEmployeeDetails(data[0]);
          setViewDetails(true);
        } else {
          setError("Employee details not found.");
        }
      })
      .catch((error) => {
        setError("Error fetching employee details. Please try again later.");
        console.error("Error fetching employee details:", error);
      })
      .finally(() => setLoading(false));
  };

  const calculateTotalSalary = () => {
    const { salary_basic, salary_da, salary_hra, salary_maintenance } = employeeDetails;
    return (
      parseFloat(salary_basic || 0) +
      parseFloat(salary_da || 0) +
      parseFloat(salary_hra || 0) +
      parseFloat(salary_maintenance || 0)
    );
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalarySubmit = () => {
    const updatedSalary = {
      ...salaryDetails,
      employee_id: employeeDetails.id,
    };

    fetch("http://localhost/login-backend/updatesalary.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSalary),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Salary updated successfully!");
          setEmployeeDetails((prevDetails) => ({
            ...prevDetails,
            ...salaryDetails,
          }));
          setIsSalaryFormVisible(false);
        } else {
          alert("Failed to update salary.");
        }
      })
      .catch((error) => {
        console.error("Error updating salary:", error);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      {!viewDetails ? (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Employee List</h3>
          {/* Search Bar aligned to the left */}
<div className="relative max-w-md mb-6 ml-0">  
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by ID, Name, or Email..."
    className="w-full py-3 pl-12 pr-4 bg-gradient-to-r from-gray-50 to-white text-gray-800 border-2 border-black-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
  />
  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-500 text-lg" />
</div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      fetchEmployeeDetails(employee.id);
                    }}
                    className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">{employee.id}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">{employee.name}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">{employee.email || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setViewDetails(false)}
            className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-semibold"
          >
            ← Back to Employee List
          </button>
          {employeeDetails && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-8">
                {employeeDetails.image ? (
                  <img
                    src={`http://localhost/login-backend/${employeeDetails.image}`}
                    alt="Employee"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {employeeDetails.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{employeeDetails.name}</h2>
                  <p className="text-sm text-gray-500">Employee Details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-lg text-gray-800">{employeeDetails.address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="text-lg text-gray-800">{employeeDetails.date_of_birth || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Number</p>
                      <p className="text-lg text-gray-800">{employeeDetails.contact_number || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg text-gray-800">{employeeDetails.email || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Bank Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="text-lg text-gray-800">{employeeDetails.account_number || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p className="text-lg text-gray-800">{employeeDetails.ifsc_code || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Basic Salary</p>
                    <p className="text-lg text-gray-800">₹{employeeDetails.salary_basic || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">DA</p>
                    <p className="text-lg text-gray-800">₹{employeeDetails.salary_da || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">HRA</p>
                    <p className="text-lg text-gray-800">₹{employeeDetails.salary_hra || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Maintenance Allowance</p>
                    <p className="text-lg text-gray-800">₹{employeeDetails.salary_maintenance || "N/A"}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-600">Total Salary</p>
                  <p className="text-xl font-bold text-gray-800">₹{calculateTotalSalary()}</p>
                </div>
              </div>
              <button
                onClick={() => setIsSalaryFormVisible(!isSalaryFormVisible)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-semibold"
              >
                {isSalaryFormVisible ? "Hide Salary Form" : "Set Salary"}
              </button>
              {isSalaryFormVisible && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(salaryDetails).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.replace("_", " ").toUpperCase()}
                        </label>
                        <input
                          type="number"
                          name={key}
                          value={salaryDetails[key]}
                          onChange={handleSalaryChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSalarySubmit}
                    className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-semibold"
                  >
                    Save Salary
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;