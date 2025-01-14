import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileInvoiceDollar, FaUpload, FaArrowLeft } from "react-icons/fa";

// Import the separate components
import GenerateQuotation from "./GenerateQuotation";
import SavedQuotation from "./SavedQuotation";
import GenerateBill from "./GenerateBill";
import Media from "./Media";

const ProjectDetail = () => {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState(""); // State for project name
  const [activeForm, setActiveForm] = useState(null); // 'quotation', 'bill', 'media'

  useEffect(() => {
    // Fetch project name from the backend
    const fetchProjectName = async () => {
      try {
        const response = await fetch(
          `http://localhost/login-backend/get_project_details.php?clientId=${clientId}&projectId=${projectId}`
        );
        const data = await response.json();
        if (data.success) {
          setProjectName(data.project_name); // Set the project name
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
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <header className="flex items-center mb-4">
          <button onClick={handleBack} className="text-gray-700">
            <FaArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold mx-auto">Project Details</h2>
          <img
            src="https://www.saisamarthpolytech.com/images/logo.png"
            alt="Logo"
            className="h-10 w-auto ml-4"
          />
        </header>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Project Name: <span className="text-gray-600">{projectName}</span>
          </h3>
          <h4 className="text-lg text-gray-500">Client ID: {clientId}</h4>
        </div>

        <div className="flex flex-col space-y-4 mb-4">
          <h4 className="text-lg font-semibold">Actions</h4>
          {/* Generate Quotation Button */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleForm("quotation")}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center transition duration-300 hover:bg-green-700"
            >
              <FaFileInvoiceDollar className="mr-2" />
              Generate Quotation
            </button>
            {activeForm === "quotation" && (
              <GenerateQuotation
                clientId={clientId}
                projectId={projectId}
                onClose={() => setActiveForm(null)}
              />
            )}
          </div>
          
           {/* Generate Bill Button */}
           <div className="flex flex-col">
            <button
              onClick={() => toggleForm("SavedQuotation")}
              className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center transition duration-300 hover:bg-yellow-700"
            >
              <FaFileInvoiceDollar className="mr-2" />
              Saved Quotations
            </button>
            {activeForm === "SavedQuotation" && (
              <SavedQuotation
                clientId={clientId}
                projectId={projectId}
                onClose={() => setActiveForm(null)}
              />
            )}
          </div>

          {/* Generate Bill Button */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleForm("bill")}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center transition duration-300 hover:bg-blue-700"
            >
              <FaFileInvoiceDollar className="mr-2" />
              Generate Bill
            </button>
            {activeForm === "bill" && (
              <GenerateBill
                clientId={clientId}
                projectId={projectId}
                onClose={() => setActiveForm(null)}
              />
            )}
          </div>

          {/* Media Button */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleForm("media")}
              className="bg-purple-600 text-white px-4 py-2 rounded flex items-center transition duration-300 hover:bg-purple-700"
            >
              <FaUpload className="mr-2" />
              Media
            </button>
            {activeForm === "media" && (
              <Media
                clientId={clientId}
                projectId={projectId}
                onClose={() => setActiveForm(null)}
              />
            )}
          </div>
        </div>

        {/* Additional Project Details can be added here */}
      </div>
    </div>
  );
};

export default ProjectDetail;