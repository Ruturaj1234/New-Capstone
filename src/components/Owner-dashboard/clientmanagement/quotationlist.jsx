/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { ArrowLeft } from "lucide-react";

const Quotationlist = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const { company } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      fetch(
        `http://localhost/login-backend/Owner-management/getProjects.php?client_name=${encodeURIComponent(company)}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched Projects:", data);
          if (data.success) {
            setProjects(data.projects);
            setError(null);
          } else {
            setProjects([]);
            setError(data.message || "No projects found for this company.");
          }
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
          setError("Failed to fetch projects. Please try again.");
          setProjects([]);
        });
    }
  }, [company]);

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    (project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.project_description && project.project_description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 focus:outline-none"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Back</span>
        </button>

        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Projects for {decodeURIComponent(company)}
        </h1>

        {error ? (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {projects.length > 0 && (
              <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                Click on a project to view more details.
              </p>
            )}
            {projects.length > 0 && (
              <div className="mb-6 flex justify-center">
                <input
                  type="text"
                  placeholder="Search for projects..."
                  className="px-4 py-2 w-full max-w-md rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <Link
                    to={`/info/${encodeURIComponent(company)}/${project.id}`}
                    key={project.id}
                    className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer group"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {project.project_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {project.project_description}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-100 rounded-lg shadow-inner">
                  <p className="text-2xl font-bold text-gray-700">No Projects Found</p>
                  <p className="text-md text-gray-500 mt-2">There are currently no projects available for this company.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Quotationlist;