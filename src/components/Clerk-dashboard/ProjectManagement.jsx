import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate

const ProjectManagement = () => {
  const { clientId } = useParams(); // Get client ID from URL
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientName, setClientName] = useState(""); // State to store client name
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    fetchProjects(); // Fetch projects on component mount
  }, []);

  // Function to fetch projects for the given client
  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost/login-backend/get_projects.php?clientId=${clientId}`);
      const data = await response.json();

      if (data.success) {
        setClientName(data.clientName); // Set the client name
        setProjects(data.projects); // Set the projects
      } else {
        alert("Failed to fetch projects: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Function to add a project
  const handleAddProject = async () => {
    if (projectName.trim()) {
      const formData = new FormData();
      formData.append("clientId", clientId);
      formData.append("projectName", projectName);
      formData.append("projectDescription", projectDescription);

      try {
        const response = await fetch("http://localhost/login-backend/add_project.php", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          setProjectName("");
          setProjectDescription("");
          fetchProjects(); // Refresh the list of projects after adding
        } else {
          alert("Failed to add project: " + data.message);
        }
      } catch (error) {
        console.error("Error adding project:", error);
      }
    } else {
      alert("Project name cannot be empty");
    }
  };

  // Function to handle project click
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${clientId}/${projectId}`); // Use clientId and projectId dynamically
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Projects for Client {clientName || clientId}</h2> {/* Display client name or client ID if name is not available */}

        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            className="border rounded-lg p-2 w-1/3"
          />
          <input
            type="text"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Project Description"
            className="border rounded-lg p-2 w-1/3 ml-2"
          />
          <button
            onClick={handleAddProject}
            className="bg-orange-600 text-white px-4 py-2 rounded ml-2"
          >
            Add Project
          </button>
        </div>

        <div className="overflow-y-auto max-h-60">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={index}
                onClick={() => handleProjectClick(project.id)} // Handle click to navigate to project details
                className="bg-white p-4 mb-2 shadow rounded-lg cursor-pointer"
              >
                <span>{project.project_name}</span>
                <span className="ml-2 text-sm text-gray-500">{project.created_at}</span>
              </div>
            ))
          ) : (
            <div className="bg-white p-4 mb-2 shadow rounded-lg">
              <span>No projects added yet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
