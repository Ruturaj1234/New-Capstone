import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaBars,
  FaEdit,
  FaTrashAlt,
  FaEllipsisV,
  FaArrowLeft,
} from "react-icons/fa"; // Added FaArrowLeft
import Sidebar from "./Sidebar";

// Dropdown Component
const DropdownMenu = ({ project, handleEditProject, handleDeleteProject }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 absolute top-2 right-2"
      >
        <FaEllipsisV />
      </button>
      {isOpen && (
        <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg p-2 z-10 w-40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditProject(project);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProject(project.id);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FaTrashAlt className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({
  project,
  handleProjectClick,
  handleEditProject,
  handleDeleteProject,
}) => (
  <div
    className="bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative"
    onClick={() => handleProjectClick(project.id)}
  >
    {/* Dropdown Menu positioned at the top-right of the card */}
    <DropdownMenu
      project={project}
      handleEditProject={handleEditProject}
      handleDeleteProject={handleDeleteProject}
    />
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-800">
        {project.project_name}
      </h3>
      <p className="text-sm text-gray-500 mt-2">
        Created at: {project.created_at}
      </p>
    </div>
  </div>
);

const ProjectManagement = () => {
  const { clientId } = useParams();
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `http://localhost/login-backend/get_projects.php?clientId=${clientId}`
      );
      const data = await response.json();

      if (data.success) {
        setClientName(data.clientName);
        setProjects(data.projects);
      } else {
        alert("Failed to fetch projects: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddProject = async () => {
    if (projectName.trim()) {
      const formData = new FormData();
      formData.append("clientId", clientId);
      formData.append("projectName", projectName);
      formData.append("projectDescription", projectDescription);

      try {
        const response = await fetch(
          "http://localhost/login-backend/add_project.php",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          setProjectName("");
          setProjectDescription("");
          fetchProjects();
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

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${clientId}/${projectId}`);
  };

  const handleEditProject = (project) => {
    // Add logic to handle project editing
    alert(`Edit project: ${project.project_name}`);
  };

  const handleDeleteProject = (projectId) => {
    // Add logic to handle project deletion
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );
    setProjects(updatedProjects);
    alert(`Deleted project with ID: ${projectId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto mr-4"
            />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Main Section */}
        <main className="flex-1 flex flex-col items-center p-6">
          {/* Back Button for Project Details Page */}
          {window.location.pathname.includes("/projects/") && (
            <button
              onClick={() => navigate(-1)} // Navigate back to the previous page
              className="self-start flex items-center text-gray-700 hover:text-gray-900 mb-4"
            >
              <FaArrowLeft className="mr-2" /> Back to Projects
            </button>
          )}

          <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6">
            Projects for Client{" "}
            <span className="text-orange-600">{clientName || clientId}</span>
          </h2>

          {/* Add Project Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full max-w-4xl">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="border border-gray-300 rounded-lg p-3 w-full sm:w-1/2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
            <input
              type="text"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Project Description"
              className="border border-gray-300 rounded-lg p-3 w-full sm:w-1/2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
            <button
              onClick={handleAddProject}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center justify-center text-sm shadow-md hover:bg-orange-700 transition duration-200"
            >
              <FaPlus className="mr-2" />
              Add Project
            </button>
          </div>

          {/* Project List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-2">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  handleProjectClick={handleProjectClick}
                  handleEditProject={handleEditProject}
                  handleDeleteProject={handleDeleteProject}
                />
              ))
            ) : (
              <div className="col-span-full bg-white p-6 shadow-lg rounded-lg text-center">
                <span className="text-lg text-gray-500">
                  No projects added yet.
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectManagement;
