import React, { useState, useEffect } from "react";
import { FaBars, FaEdit, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";

const AssignedProjects = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // For dropdown toggle

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [formData, setFormData] = useState({
    date_completed: currentDate,
    time_completed: currentTime,
    challenges: "",
    additional_notes: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost/login-backend/get_employee_assigned_projects.php"
        );
        const data = await response.json();

        if (data.success) {
          setProjects(data.projects);
        } else {
          setProjects([]);
          setError(data.message || "No projects found.");
        }
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
      }
    };

    const checkIfUserIsLeader = async () => {
      try {
        const response = await fetch(
          "http://localhost/login-backend/check_user_leader.php"
        );
        const data = await response.json();

        if (data.success && data.isLeader) {
          setIsLeader(true);
        }
      } catch (err) {
        console.error("Failed to check if user is a leader");
      }
    };

    fetchProjects();
    checkIfUserIsLeader();
  }, []);

  const handleProjectClick = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost/login-backend/get_employee_assigned_projects.php?project_id=${projectId}`
      );
      const data = await response.json();

      if (data.success) {
        setSelectedProject(data.project);
      } else {
        setSelectedProject(null);
        setError("Failed to fetch project details.");
      }
    } catch (err) {
      setSelectedProject(null);
      setError("Failed to fetch project details. Please try again later.");
    }
  };

  const toggleDropdown = (projectId) => {
    setSelectedProjectId(selectedProjectId === projectId ? null : projectId);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = { ...formData, project_id: selectedProject.id };

    try {
      const response = await fetch(
        "http://localhost/login-backend/submit_project_done.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Project marked as completed successfully!");
        setShowForm(false);
      } else {
        alert("Failed to submit project data. Please try again.");
      }
    } catch (err) {
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-white p-4 shadow-md flex items-center justify-between">
          <img
            src="https://www.saisamarthpolytech.com/images/logo.png"
            alt="Sai Samarth Polytech"
            className="h-10 w-auto"
          />
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <FaBars size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <h1 className="text-3xl font-bold text-orange-600 mb-6 text-left">
            Assigned Projects
          </h1>

          {!selectedProject ? (
            error ? (
              <div className="text-red-600 text-center">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="relative border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-orange-600 transition duration-300 transform hover:-translate-y-1"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-600">
                      {project.project_name}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {project.project_description
                        ? project.project_description.slice(0, 50) + "..."
                        : "No description available"}
                    </p>

                    {/* Dropdown Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(project.id);
                      }}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      <FaEllipsisV />
                    </button>

                    {/* Dropdown Menu */}
                    {selectedProjectId === project.id && (
                      <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg p-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Edit ${project.project_name}`);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Delete ${project.project_name}`);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FaTrashAlt className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="w-full p-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-700 hover:text-orange-600 mb-4 flex items-center"
                aria-label="Back to Projects"
              >
                ← Back to Projects
              </button>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedProject.project_name}
                </h2>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Project Details:
                </h3>
                <p>{selectedProject.project_description}</p>
                <p className="mt-2">
                  <strong>Client:</strong> {selectedProject.client_name}
                </p>
                <p className="mt-2">
                  <strong>Leader:</strong> {selectedProject.project_leader}
                </p>
                <p className="mt-2">
                  <strong>Message:</strong> {selectedProject.message}
                </p>
                <p className="mt-2">
                  <strong>Quotation Date:</strong>{" "}
                  {new Date(
                    selectedProject.quotation_date
                  ).toLocaleDateString()}
                </p>
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-200 text-left">
                    <tr>
                      <th className="px-4 py-2 text-left">Product Name</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.products.map((product, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{product.name}</td>
                        <td className="border px-4 py-2">{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* "Project Done" button for leader only */}
                {isLeader && (
                  <div>
                    <button
                      className="mt-6 bg-green-500 text-white p-2 rounded-lg"
                      onClick={() => setShowForm((prev) => !prev)}
                    >
                      Project Done
                    </button>

                    {showForm && (
                      <form onSubmit={handleFormSubmit} className="mt-4">
                        <label className="block mb-2">
                          Date Completed:
                          <input
                            type="text"
                            name="date_completed"
                            value={formData.date_completed}
                            disabled
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                          />
                        </label>

                        <label className="block mb-2">
                          Time Completed:
                          <input
                            type="text"
                            name="time_completed"
                            value={formData.time_completed}
                            disabled
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                          />
                        </label>

                        <label className="block mb-2">
                          Challenges:
                          <textarea
                            name="challenges"
                            value={formData.challenges}
                            onChange={handleFormChange}
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                          ></textarea>
                        </label>

                        <label className="block mb-2">
                          Additional Notes:
                          <textarea
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleFormChange}
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                          ></textarea>
                        </label>

                        <button
                          type="submit"
                          className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
                        >
                          Submit
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AssignedProjects;