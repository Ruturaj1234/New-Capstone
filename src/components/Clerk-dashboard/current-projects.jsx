import React, { useState, useEffect } from "react";
import { ChevronLeft, Save } from "lucide-react"; // Modern icons
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

  useEffect(() => {
    fetch("http://localhost/login-backend/get_assigned_companies.php")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => {
        console.error("Error fetching companies:", err);
        toast.error("Failed to fetch companies. Please try again.");
      });
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetch(`http://localhost/login-backend/fetch_assigned_projects.php?client_id=${selectedCompany.id}`)
        .then((res) => res.json())
        .then((data) => setProjects(data.projects || []))
        .catch((err) => {
          console.error("Error fetching projects:", err);
          toast.error("Failed to fetch projects. Please try again.");
        });
    }
  }, [selectedCompany]);

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
          toast.error("Failed to fetch employees. Please try again.");
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
          toast.success("Project updated successfully!");
        } else {
          toast.error("Failed to update project.");
        }
      })
      .catch((err) => {
        console.error("Error updating project:", err);
        toast.error("Error updating project. Please try again.");
      });
  };

  return (
    <div className="p-4">
      {/* Back Navigation for Projects Section */}
      {selectedCompany && !selectedProject && (
        <button
          onClick={() => setSelectedCompany(null)}
          className="mb-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeft size={16} />
          Back to Companies
        </button>
      )}

      {/* Back Navigation for Manage Project Section */}
      {selectedProject && (
        <button
          onClick={() => setSelectedProject(null)}
          className="mb-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeft size={16} />
          Back to Projects
        </button>
      )}

      {!selectedCompany ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Select a Company</h2>
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
          <h2 className="text-xl font-bold mb-4 text-gray-800">Select a Project</h2>
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
          <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Project</h2>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Update Project Leader</h3>
          <select
            value={projectLeader}
            onChange={(e) => setProjectLeader(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full max-w-xs"
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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={employee.employee_id}
                  checked={allocatedEmployees.includes(Number(employee.employee_id))}
                  onChange={(e) => {
                    const id = Number(employee.employee_id);
                    setAllocatedEmployees((prev) =>
                      e.target.checked ? [...prev, id] : prev.filter((empId) => empId !== id)
                    );
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-700">{employee.username}</span>
              </label>
            </div>
          ))}

          <button
            onClick={handleSubmitProject}
            className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
          >
            <Save size={16} />
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