import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileInvoiceDollar, FaChartLine, FaArrowLeft } from "react-icons/fa";
import GenerateQuotation from "./GenerateQuotation";
import SavedQuotation from "./SavedQuotation";
import GenerateBill from "./GenerateBill";
import TrackRecords from "./TrackRecords"; // Updated component name
import Sidebar from "./Sidebar";

const ProjectDetail = () => {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await fetch(
          `http://localhost/login-backend/get_project_details.php?clientId=${clientId}&projectId=${projectId}`
        );
        const data = await response.json();
        if (data.success) {
          setProjectName(data.project_name);
        } else {
          alert("Failed to fetch project name: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching project name:", error);
      }
    };

    fetchProjectName();
  }, [clientId, projectId]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleForm = (formName) => {
    setActiveForm((prevForm) => (prevForm === formName ? null : formName));
  };

  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex flex-col items-center bg-gray-50 p-6 min-h-screen w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-4xl">
          <div className="border-b border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 transition duration-300"
              >
                <FaArrowLeft size={24} />
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                Project Details
              </h2>
              <img
                src="https://www.saisamarthpolytech.com/images/logo.png"
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700">
                Project Name:{" "}
                <span className="text-gray-500 font-medium">{projectName}</span>
              </h3>
              <h4 className="text-lg text-gray-400">Client ID: {clientId}</h4>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Actions</h4>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => toggleForm("quotation")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FaFileInvoiceDollar className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Generate Quotation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create a new project quotation.
                  </p>
                </div>
              </button>
              {activeForm === "quotation" && (
                <GenerateQuotation
                  clientId={clientId}
                  projectId={projectId}
                  onClose={() => setActiveForm(null)}
                />
              )}
              <button
                onClick={() => toggleForm("SavedQuotation")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
              >
                <div className="p-4 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <FaFileInvoiceDollar className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Saved Quotations
                  </h3>
                  <p className="text-sm text-gray-500">
                    View or edit saved quotations.
                  </p>
                </div>
              </button>
              {activeForm === "SavedQuotation" && (
                <SavedQuotation
                  clientId={clientId}
                  projectId={projectId}
                  onClose={() => setActiveForm(null)}
                />
              )}
              <button
                onClick={() => toggleForm("bill")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="p-4 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FaFileInvoiceDollar className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Generate Bill
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create a bill for this project.
                  </p>
                </div>
              </button>
              {activeForm === "bill" && (
                <GenerateBill
                  clientId={clientId}
                  projectId={projectId}
                  onClose={() => setActiveForm(null)}
                />
              )}
              <button
                onClick={() => toggleForm("trackRecords")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="p-4 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <FaChartLine className="w-8 h-8 text-purple-600" /> {/* Updated icon */}
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Track Records
                  </h3>
                  <p className="text-sm text-gray-500">
                    View project progress and status.
                  </p>
                </div>
              </button>
              {activeForm === "trackRecords" && (
                <TrackRecords
                  clientId={clientId}
                  projectId={projectId}
                  onClose={() => setActiveForm(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;