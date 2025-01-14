// AssignedProjects.jsx
import React, { useState } from "react";

const AssignedProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = [
    {
      id: 1,
      name: "Project Alpha",
      description: "Infrastructure improvement project for the client site.",
    },
    {
      id: 2,
      name: "Project Beta",
      description: "Development of a new product line for a pharmaceutical client.",
    },
    {
      id: 3,
      name: "Project Gamma",
      description: "Enhancement of marketing and client engagement processes.",
    },
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleSend = () => {
    alert("Images and message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-4">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Assigned Projects
        </h1>
        {!selectedProject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-orange-600 transition"
                onClick={() => handleProjectClick(project)}
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {project.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {project.description.slice(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-700 hover:text-orange-600 mb-4"
            >
              ← Back to Projects
            </button>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedProject.name}
              </h2>
              <p className="text-gray-600 mb-6">{selectedProject.description}</p>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="block w-full bg-gray-100 border border-gray-300 rounded-lg p-2 mb-4"
                />
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="block w-full bg-gray-100 border border-gray-300 rounded-lg p-2 mb-4"
                  placeholder="Enter your message..."
                ></textarea>
                <button
                  onClick={handleSend}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedProjects;