import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Import the back arrow icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectLeader, setProjectLeader] = useState("");
  const [allocatedEmployees, setAllocatedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Test toast on component mount
  useEffect(() => {
  }, []);

  // Fetch assigned companies
  useEffect(() => {
    fetch("http://localhost/login-backend/get_assigned_companies.php")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => {
        console.error("Error fetching companies:", err);
        toast.error("Failed to fetch companies. Please try again."); // Error toast
      });
  }, []);

  // Fetch projects assigned to a selected company
  useEffect(() => {
    if (selectedCompany) {
      fetch(`http://localhost/login-backend/fetch_assigned_projects.php?client_id=${selectedCompany.id}`)
        .then((res) => res.json())
        .then((data) => setProjects(data.projects || []))
        .catch((err) => {
          console.error("Error fetching projects:", err);
          toast.error("Failed to fetch projects. Please try again."); // Error toast
        });
    }
  }, [selectedCompany]);

  // Fetch employees from the `users` table and assigned employees for a selected project
  useEffect(() => {
    if (selectedProject) {
      fetch(`http://localhost/login-backend/fetch_assigned_employees.php?project_id=${selectedProject.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProjectLeader(data.leader_id || "");
          setAllocatedEmployees(data.assigned_employees || []);
          setEmployees(data.employees || []);
        })
        .catch((err) => {
          console.error("Error fetching employees:", err);
          toast.error("Failed to fetch employees. Please try again."); // Error toast
        });
    }
  }, [selectedProject]);

  const handleSubmitProject = () => {
    const projectData = {
      project_id: selectedProject?.id,
      leader_id: projectLeader,
      allocated_employees: allocatedEmployees,
    };

    fetch("http://localhost/login-backend/update_assigned_employees.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Project updated successfully!"); // Success toast
        } else {
          toast.error("Failed to update project."); // Error toast
        }
      })
      .catch((err) => {
        console.error("Error updating project:", err);
        toast.error("Error updating project. Please try again."); // Error toast
      });
  };

  return (
    <div className="p-4">
      {/* Back Navigation for Projects Section */}
      {selectedCompany && !selectedProject && (
        <button
          onClick={() => setSelectedCompany(null)} // Go back to companies
          className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Companies
        </button>
      )}

      {/* Back Navigation for Manage Project Section */}
      {selectedProject && (
        <button
          onClick={() => setSelectedProject(null)} // Go back to projects
          className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Projects
        </button>
      )}

      {!selectedCompany ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Select a Company</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                onClick={() => setSelectedCompany(company)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{company.client_name}</h3>
                <p className="text-sm text-gray-500">ID: {company.id}</p>
              </div>
            ))}
          </div>
        </div>
      ) : !selectedProject ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Select a Project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                onClick={() => setSelectedProject(project)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{project.project_name}</h3>
                <p className="text-sm text-gray-500">ID: {project.id}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Project</h2>
          <h3 className="text-lg font-bold mt-4">Update Project Leader</h3>
          <select
            value={projectLeader}
            onChange={(e) => setProjectLeader(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Select Leader</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.username}
              </option>
            ))}
          </select>

          {employees.map((employee) => (
            <div key={employee.employee_id} className="mb-2">
              <label>
                <input
                  type="checkbox"
                  value={employee.employee_id}
                  checked={allocatedEmployees.includes(Number(employee.employee_id))}
                  onChange={(e) => {
                    const id = Number(employee.employee_id);
                    setAllocatedEmployees((prev) =>
                      e.target.checked
                        ? [...prev, id] // Add employee ID if checked
                        : prev.filter((empId) => empId !== id) // Remove if unchecked
                    );
                  }}
                />
                {employee.username}
              </label>
            </div>
          ))}

          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmitProject}
          >
            Submit
          </button>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProjectManagement;