import React, { useState, useEffect } from "react";

const ProjectManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectLeader, setProjectLeader] = useState("");
  const [allocatedEmployees, setAllocatedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Fetch assigned companies
  useEffect(() => {
    fetch("http://localhost/login-backend/get_assigned_companies.php")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  // Fetch projects assigned to a selected company
  useEffect(() => {
    if (selectedCompany) {
      fetch(`http://localhost/login-backend/fetch_assigned_projects.php?client_id=${selectedCompany.id}`)
        .then((res) => res.json())
        .then((data) => setProjects(data.projects || []))
        .catch((err) => console.error("Error fetching projects:", err));
    }
  }, [selectedCompany]);

  // Fetch assigned employees and project leader for a selected project
  useEffect(() => {
    if (selectedProject) {
      fetch(`http://localhost/login-backend/fetch_assigned_employees.php?project_id=${selectedProject.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProjectLeader(data.leader_id || "");
          setAllocatedEmployees(data.allocated_employees || []);
        })
        .catch((err) => console.error("Error fetching employees:", err));
    }
  }, [selectedProject]);

  const handleAllocateEmployee = (id) => {
    if (!allocatedEmployees.includes(id)) {
      setAllocatedEmployees((prev) => [...prev, id]);
    }
  };

  const handleDeallocateEmployee = (id) => {
    setAllocatedEmployees((prev) => prev.filter((empId) => empId !== id));
  };

  const handleSubmitProject = () => {
    const projectData = {
      project_id: selectedProject?.id,
      leader_id: projectLeader,
      allocated_employees: allocatedEmployees,
    };

    fetch("http://localhost/login-backend/update_project.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Project updated successfully!");
        } else {
          alert("Failed to update project.");
        }
      })
      .catch((err) => console.error("Error updating project:", err));
  };

  return (
    <div className="p-4">
      {!selectedCompany ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Select a Company</h2>
          <ul>
            {companies.map((company) => (
              <li
                key={company.id}
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setSelectedCompany(company)}
              >
                {company.client_name}
              </li>
            ))}
          </ul>
        </div>
      ) : !selectedProject ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Select a Project</h2>
          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setSelectedProject(project)}
              >
                {project.project_name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Project</h2>
          <h3 className="text-lg font-bold mt-4">Project Leader</h3>
          <select
            value={projectLeader}
            onChange={(e) => setProjectLeader(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Select Leader</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.username}
              </option>
            ))}
          </select>

          <h3 className="text-lg font-bold mt-4">Allocated Employees</h3>
          <ul>
            {employees.map((emp) => (
              <li key={emp.id} className="flex items-center">
                <span className="flex-1">{emp.username}</span>
                {allocatedEmployees.includes(emp.id) ? (
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeallocateEmployee(emp.id)}
                  >
                    Deallocate
                  </button>
                ) : (
                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => handleAllocateEmployee(emp.id)}
                  >
                    Allocate
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmitProject}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
