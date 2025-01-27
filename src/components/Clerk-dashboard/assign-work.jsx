import React, { useEffect, useState } from "react";

const AssignWork = () => {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [projectLeader, setProjectLeader] = useState(null);
  const [message, setMessage] = useState("");
  const [noProjectsMessage, setNoProjectsMessage] = useState("");
  const [step, setStep] = useState("company"); // 'company', 'project', or 'employee'

  // Fetch companies (from projects table)
  useEffect(() => {
    fetch("http://localhost/login-backend/get_companies.php")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  // Fetch employee names
  useEffect(() => {
    fetch("http://localhost/login-backend/fetchemployees.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          setEmployees(data);
        }
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setStep("project"); // Navigate to project step
    setSelectedProject(null);
    setSelectedEmployees([]);

    // Fetch projects for the selected company
    fetch(`http://localhost/login-backend/get_client_projects.php?client_id=${company.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setProjects(data);
          setNoProjectsMessage("");
        } else {
          setProjects([]);
          setNoProjectsMessage(`No projects found for ${company.client_name}`);
        }
      })
      .catch((error) => console.error("Error fetching projects:", error));
  };

  const handleProjectSelect = (project) => {
    // Ensure the project object has a client_id and project_name before sending the request
    if (!selectedCompany || !project.project_name) {
      alert("Missing company or project data");
      return;
    }

    // Check if the selected project is already assigned
    fetch("http://localhost/login-backend/check_project.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: selectedCompany.id, // Ensure the company ID is sent
        project_name: project.project_name, // Ensure the project name is sent
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "exists") {
          // If the project is already assigned, show an alert
          alert("This project is already assigned.");
        } else {
          // If the project is not assigned, proceed with the selection
          setSelectedProject(project);
          setStep("employee"); // Navigate to employee step
        }
      })
      .catch((error) => {
        console.error("Error checking project assignment:", error);
        alert("Failed to check project assignment. Please try again later.");
      });
  };

  const handleBack = () => {
    if (step === "employee") setStep("project");
    else if (step === "project") setStep("company");
  };

  const handleAssign = () => {
    const data = {
      project_id: selectedProject.id,
      employee_ids: selectedEmployees, // Pass the entire array of selected employee IDs
      project_leader: projectLeader,
      message: message,
    };

    // Send the data to the PHP backend using fetch
    fetch("http://localhost/login-backend/assign_project.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert(`Project "${selectedProject.project_name}" assigned successfully!`);

          // Reset states after successful assignment
          setStep("company");
          setSelectedCompany(null);
          setSelectedProject(null);
          setSelectedEmployees([]);
          setProjectLeader(null);
          setMessage("");
        } else {
          alert(`Error: ${result.message}`);
        }
      })
      .catch((error) => {
        console.error("Error assigning project:", error);
        alert("Failed to assign project. Please try again later.");
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-8">Assign Work</h3>
      {step !== "company" && (
        <button
          onClick={handleBack}
          className="font-semibold mb-6 transition-colors duration-200"
        >
          ← Back
        </button>
      )}

      {step === "company" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Company:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                onClick={() => handleCompanySelect(company)}
                className="bg-gray-50 p-6 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all duration-200"
              >
                <h4 className="font-semibold text-gray-800 text-center">
                  {company.client_name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "project" && (
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-6">
            Company: {selectedCompany.client_name}
          </h4>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Project:
          </label>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className="bg-gray-50 px-6 py-3 rounded-lg transition-all hover:bg-gray-100 duration-200 font-semibold text-gray-800"
                >
                  {project.project_name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-red-500">{noProjectsMessage}</p>
          )}
        </div>
      )}

      {step === "employee" && (
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-6">
            Project: {selectedProject.project_name}
          </h4>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Employees:
            </label>
            <div className="space-y-3">
              {employees.map((employee, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    value={employee.id}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedEmployees((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((empId) => empId !== id)
                      );
                    }}
                    className="mr-2 h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-800">{employee.username}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Project Leader:
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              value={projectLeader || ""}
              onChange={(e) => setProjectLeader(e.target.value)}
            >
              <option value="">--Select Leader--</option>
              {employees.map((employee, index) => (
                <option key={index} value={employee.id}>
                  {employee.username}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              rows="3"
            />
          </div>

          <button
            onClick={handleAssign}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-200"
          >
            Assign Project
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignWork;