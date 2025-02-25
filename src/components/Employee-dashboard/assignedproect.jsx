import React, { useState, useEffect } from "react";
import { FaBars, FaEdit, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";

const AssignedProjects = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [reportFormData, setReportFormData] = useState({
    challenges: "",
    progress_percentage: "0",
    image: null,
    image2: null,
    image3: null,
    summary_work_completed: "",
    next_steps: "",
    estimated_completion_date: ""
  });

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost/login-backend/get_employee_assigned_projects.php");
      const data = await response.json();
      if (data.success) {
        const allProjects = [...data.leader_projects, ...data.employee_projects];
        setProjects(allProjects);
      } else {
        setProjects([]);
        setError(data.message || "No projects found.");
      }
    } catch (err) {
      setError("Failed to fetch projects. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = async (projectId) => {
    try {
      const response = await fetch(`http://localhost/login-backend/get_employee_assigned_projects.php?project_id=${projectId}`);
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

  const fetchReportData = async (projectId) => {
    try {
      const response = await fetch(`http://localhost/login-backend/get_track_records.php?project_id=${projectId}`);
      const data = await response.json();
      if (data.success && data.track_records.status !== "Not Assigned Yet") {
        setReportFormData({
          challenges: data.track_records.challenges,
          progress_percentage: data.track_records.progress_percentage.toString(),
          image: null, // File inputs can't be prefilled, but we keep null for new uploads
          image2: null,
          image3: null,
          summary_work_completed: data.track_records.summary_work_completed,
          next_steps: data.track_records.next_steps,
          estimated_completion_date: data.track_records.estimated_completion_date || ""
        });
      } else {
        // Reset form if no report exists or not assigned
        setReportFormData({
          challenges: "",
          progress_percentage: "0",
          image: null,
          image2: null,
          image3: null,
          summary_work_completed: "",
          next_steps: "",
          estimated_completion_date: ""
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      setReportFormData({
        challenges: "",
        progress_percentage: "0",
        image: null,
        image2: null,
        image3: null,
        summary_work_completed: "",
        next_steps: "",
        estimated_completion_date: ""
      });
    }
    setShowReportForm(true);
  };

  const handleReportFormChange = (e) => {
    const { name, value, files } = e.target;
    setReportFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedProject.id) {
      alert("Error: Project ID is missing.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("project_id", selectedProject.id);
    formDataToSend.append("challenges", reportFormData.challenges);
    formDataToSend.append("progress_percentage", reportFormData.progress_percentage);
    if (reportFormData.image) formDataToSend.append("image", reportFormData.image);
    if (reportFormData.image2) formDataToSend.append("image2", reportFormData.image2);
    if (reportFormData.image3) formDataToSend.append("image3", reportFormData.image3);
    formDataToSend.append("summary_work_completed", reportFormData.summary_work_completed);
    formDataToSend.append("next_steps", reportFormData.next_steps);
    formDataToSend.append("estimated_completion_date", reportFormData.estimated_completion_date);

    try {
      const response = await fetch("http://localhost/login-backend/submit_project_report.php", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      if (data.success) {
        alert("Report submitted successfully!");
        setShowReportForm(false);
        setReportFormData({
          challenges: "",
          progress_percentage: "0",
          image: null,
          image2: null,
          image3: null,
          summary_work_completed: "",
          next_steps: "",
          estimated_completion_date: ""
        });
      } else {
        alert("Failed to submit report: " + data.message);
      }
    } catch (err) {
      alert("An error occurred while submitting the report.");
    }
  };

  const handleProjectDone = async () => {
    if (!selectedProject || !selectedProject.id) {
      alert("Error: Project ID is missing.");
      return;
    }
    if (!window.confirm("Are you sure you want to mark this project as done?")) return;

    const dataToSubmit = { project_id: selectedProject.id };
    try {
      const response = await fetch("http://localhost/login-backend/submit_project_done.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      const data = await response.json();
      if (data.success) {
        alert("Project marked as completed successfully!");
        setSelectedProject(null);
        fetchProjects();
      } else {
        alert("Failed to mark project as done: " + data.message);
      }
    } catch (err) {
      alert("An error occurred while marking the project as done.");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 bg-white p-4 shadow-lg flex items-center justify-between">
          <img src="https://www.saisamarthpolytech.com/images/logo.png" alt="Sai Samarth Polytech" className="h-12 w-auto" />
          <button onClick={() => setIsMobileMenuOpen((prev) => !prev)} className="text-gray-700 hover:text-orange-600 focus:outline-none lg:hidden">
            <FaBars size={28} />
          </button>
        </header>
        <main className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-orange-600 mb-8 text-left tracking-tight">Assigned Projects</h1>
          {!selectedProject ? (
            error ? (
              <div className="text-red-600 text-center text-lg">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="relative bg-white border border-gray-200 rounded-xl p-5 cursor-pointer shadow-md hover:shadow-xl hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-orange-600">{project.project_name}</h2>
                    <p className="text-gray-600 mt-2 truncate">{project.project_description || "No description available"}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleDropdown(project.id); }}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                      <FaEllipsisV />
                    </button>
                    {selectedProjectId === project.id && (
                      <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg p-2 z-10 border">
                        <button onClick={(e) => { e.stopPropagation(); alert(`Edit ${project.project_name}`); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); alert(`Delete ${project.project_name}`); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <FaTrashAlt className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="w-full p-6 bg-gray-50 rounded-xl shadow-lg">
              <button onClick={() => setSelectedProject(null)} className="text-gray-700 hover:text-orange-600 mb-6 flex items-center text-lg font-medium">
                ← Back to Projects
              </button>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedProject.project_name}</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Project Details</h3>
                <div className="space-y-3 text-gray-600">
                  <p>{selectedProject.project_description || "No description available"}</p>
                  <p><strong>Client:</strong> {selectedProject.client_name}</p>
                  <p><strong>Leader:</strong> {selectedProject.project_leader}</p>
                  <p><strong>Message:</strong> {selectedProject.message}</p>
                  <p><strong>Quotation Date:</strong> {selectedProject.quotation_date ? new Date(selectedProject.quotation_date).toLocaleDateString() : "Not available"}</p>
                  <p><strong>Associated Employees:</strong> {selectedProject.associated_employees.length > 0 ? selectedProject.associated_employees.join(", ") : "None"}</p>
                </div>
                <table className="min-w-full mt-6 border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">Product Name</th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.products.map((product, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {selectedProject.is_leader === 1 && (
                  <div className="mt-8 flex space-x-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                      onClick={() => fetchReportData(selectedProject.id)}
                    >
                      Create Report
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                      onClick={handleProjectDone}
                    >
                      Project Done
                    </button>
                  </div>
                )}

                {showReportForm && (
                  <form onSubmit={handleReportSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Report</h3>
                    <label className="block mb-4">
                      <span className="text-gray-700">Challenges:</span>
                      <textarea
                        name="challenges"
                        value={reportFormData.challenges}
                        onChange={handleReportFormChange}
                        className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Progress Percentage (%):</span>
                      <div className="flex items-center space-x-4 mt-2">
                        <input
                          type="range"
                          name="progress_percentage"
                          value={reportFormData.progress_percentage}
                          onChange={handleReportFormChange}
                          min="0"
                          max="100"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-gray-800 font-medium">{reportFormData.progress_percentage}%</span>
                      </div>
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Upload Image 1:</span>
                      <input
                        type="file"
                        name="image"
                        onChange={handleReportFormChange}
                        accept="image/*"
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Upload Image 2:</span>
                      <input
                        type="file"
                        name="image2"
                        onChange={handleReportFormChange}
                        accept="image/*"
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Upload Image 3:</span>
                      <input
                        type="file"
                        name="image3"
                        onChange={handleReportFormChange}
                        accept="image/*"
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Summary of Work Completed:</span>
                      <textarea
                        name="summary_work_completed"
                        value={reportFormData.summary_work_completed}
                        onChange={handleReportFormChange}
                        className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Next Steps:</span>
                      <textarea
                        name="next_steps"
                        value={reportFormData.next_steps}
                        onChange={handleReportFormChange}
                        className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Estimated Completion Date:</span>
                      <input
                        type="date"
                        name="estimated_completion_date"
                        value={reportFormData.estimated_completion_date}
                        onChange={handleReportFormChange}
                        className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Submit Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReportForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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