import React, { useState, useEffect } from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost/login-backend/fetchemployeedetails.php")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
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
    const { salary_basic, salary_da, salary_hra, salary_maintenance } =
      employeeDetails;
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Age
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Account Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      fetchEmployeeDetails(employee.id);
                    }}
                    className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                      {employee.name}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                      {employee.age}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                      {employee.address}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                      {employee.account_number}
                    </td>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Employee Details: {employeeDetails.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="text-lg text-gray-800">{employeeDetails.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-lg text-gray-800">
                        {employeeDetails.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Bank Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="text-lg text-gray-800">
                        {employeeDetails.account_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p className="text-lg text-gray-800">
                        {employeeDetails.ifsc_code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Salary Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Basic Salary</p>
                    <p className="text-lg text-gray-800">
                      ₹{employeeDetails.salary_basic}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">DA</p>
                    <p className="text-lg text-gray-800">
                      ₹{employeeDetails.salary_da}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">HRA</p>
                    <p className="text-lg text-gray-800">
                      ₹{employeeDetails.salary_hra}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Maintenance Allowance</p>
                    <p className="text-lg text-gray-800">
                      ₹{employeeDetails.salary_maintenance}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-600">Total Salary</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹{calculateTotalSalary()}
                  </p>
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