import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const AssignedProjects = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      name: "Project Alpha",
      description: "Infrastructure improvement project for the client site.",
      companyName: "Sai Samarth Polytech Pvt. Ltd.",
      clerkMessage: "Please ensure all materials are ready before the site visit.",
      projectLeader: "John Doe",
      products: [
        { name: "Epoxy Flooring", quantity: 100 },
        { name: "Wall Coating", quantity: 50 },
      ],
    },
    {
      id: 2,
      name: "Project Beta",
      description: "Development of a new product line for a pharmaceutical client.",
      companyName: "Sai Samarth Polytech Pvt. Ltd.",
      clerkMessage: "Client has requested a detailed schedule by next week.",
      projectLeader: "Jane Smith",
      products: [
        { name: "Polymer Resin", quantity: 200 },
        { name: "Floor Sealant", quantity: 80 },
      ],
    },
    {
      id: 3,
      name: "Project Gamma",
      description: "Enhancement of marketing and client engagement processes.",
      companyName: "Sai Samarth Polytech Pvt. Ltd.",
      clerkMessage: "Make sure to include feedback from the last survey.",
      projectLeader: "Michael Brown",
      products: [
        { name: "Dust-Free Paint", quantity: 120 },
        { name: "Antibacterial Coating", quantity: 60 },
      ],
    },
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto mr-4"
            />
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
            aria-label="Open Sidebar"
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-6">
          <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center sm:hidden">
            Assigned Projects
          </h1>

          {!selectedProject ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-orange-600 transition duration-300 transform hover:-translate-y-1"
                  onClick={() => handleProjectClick(project)}
                >
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-600">
                    {project.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {project.description.slice(0, 50)}...
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full p-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-700 hover:text-orange-600 mb-4 flex items-center"
                aria-label="Back to Projects"
              >
                ← Back to Projects
              </button>
              <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedProject.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  <strong>Company:</strong> {selectedProject.companyName}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Description:</strong> {selectedProject.description}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Message from Clerk:</strong>{" "}
                  {selectedProject.clerkMessage}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Project Leader:</strong> {selectedProject.projectLeader}
                </p>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Product Details:
                </h3>
                <table className="table-auto w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AssignedProjects;
