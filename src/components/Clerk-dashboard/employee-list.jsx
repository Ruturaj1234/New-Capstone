import React, { useState, useEffect } from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]); // Ensure it's an empty array initially
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);

  // Fetch employee list from the backend when the component mounts
  useEffect(() => {
    fetch("http://localhost/login-backend/fetchemployeedetails.php")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data); // Only set employees if data is an array
        } else {
          console.error("Fetched data is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  const fetchEmployeeDetails = (employeeId) => {
    console.log("Sending employee ID to backend:", employeeId); // Log the ID being sent to the backend
    
    fetch("http://localhost/login-backend/fetchemployeedetails.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: employeeId }), // Pass the employee ID correctly in the POST body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Employee details response:", data); // Log the response for debugging
        if (data && data[0]) {
          setEmployeeDetails(data[0]); // Assuming data[0] contains the employee details
          setViewDetails(true); // Navigate to the details view
        } else if (data.error) {
          console.error("Error fetching employee details:", data.error);
        } else {
          console.error("Unexpected response:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee details:", error);
      });
  };
  
  // Render employee list
  const employeeListItems = employees.map((employee) => (
    <li
      key={employee.id}
      onClick={() => {
        console.log("Selected employee:", employee); // Log the employee being selected
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
