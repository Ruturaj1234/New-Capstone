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
    salary_maintenance: ""
  });

  useEffect(() => {
    fetch("http://localhost/login-backend/fetchemployeedetails.php")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data); 
        } else {
          console.error("Fetched data is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  const fetchEmployeeDetails = (employeeId) => {
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
        }
      })
      .catch((error) => {
        console.error("Error fetching employee details:", error);
      });
  };

  const calculateTotalSalary = () => {
    const { salary_basic, salary_da, salary_hra, salary_maintenance } = employeeDetails;
    return parseFloat(salary_basic || 0) + parseFloat(salary_da || 0) + parseFloat(salary_hra || 0) + parseFloat(salary_maintenance || 0);
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
      employee_id: employeeDetails.id
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

  const employeeListItems = employees.map((employee) => (
    <li
      key={employee.id}
      onClick={() => {
        setSelectedEmployee(employee);
        fetchEmployeeDetails(employee.id);
      }}
      className={`py-2 px-3 cursor-pointer rounded hover:bg-blue-50 ${
        selectedEmployee?.id === employee.id ? "bg-blue-100 font-bold" : ""
      }`}
    >
      {employee.name}
    </li>
  ));

  return (
    <div>
      {!viewDetails ? (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-xl font-semibold mb-4">Employee List</h3>
          <ul className="divide-y">{employeeListItems}</ul>
        </div>
      ) : (
        <div className="mt-8">
          <button
            onClick={() => setViewDetails(false)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          {employeeDetails && (
            <div className="p-4 bg-gray-50 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{employeeDetails.name}</h2>
              <p><strong>Age:</strong> {employeeDetails.age}</p>
              <p><strong>Address:</strong> {employeeDetails.address}</p>
              <p><strong>Account Number:</strong> {employeeDetails.account_number}</p>
              <p><strong>IFSC Code:</strong> {employeeDetails.ifsc_code}</p>
              <p><strong>Basic Salary:</strong> {employeeDetails.salary_basic}</p>
              <p><strong>DA:</strong> {employeeDetails.salary_da}</p>
              <p><strong>HRA:</strong> {employeeDetails.salary_hra}</p>
              <p><strong>Maintenance Allowance:</strong> {employeeDetails.salary_maintenance}</p>

              {/* Display Total Salary */}
              <p><strong>Total Salary:</strong> ₹{calculateTotalSalary()}</p>

              <button
                onClick={() => setIsSalaryFormVisible(!isSalaryFormVisible)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Set Salary
              </button>

              {isSalaryFormVisible && (
                <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                  <div className="mb-2">
                    <label className="block mb-1">Basic Salary:</label>
                    <input
                      type="number"
                      name="salary_basic"
                      value={salaryDetails.salary_basic}
                      onChange={handleSalaryChange}
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">DA:</label>
                    <input
                      type="number"
                      name="salary_da"
                      value={salaryDetails.salary_da}
                      onChange={handleSalaryChange}
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">HRA:</label>
                    <input
                      type="number"
                      name="salary_hra"
                      value={salaryDetails.salary_hra}
                      onChange={handleSalaryChange}
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Maintenance Allowance:</label>
                    <input
                      type="number"
                      name="salary_maintenance"
                      value={salaryDetails.salary_maintenance}
                      onChange={handleSalaryChange}
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={handleSalarySubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
