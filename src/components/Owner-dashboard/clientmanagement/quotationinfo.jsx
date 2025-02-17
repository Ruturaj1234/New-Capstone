import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import {
  FileText,
  Receipt,
  Image,
  Download,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const QuotationInfo = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const { company, projectId } = useParams();
  console.log(company, projectId); // Check if these values are being correctly received

  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    console.log("Project ID:", projectId); // Ensure it's available here
    if (projectId) {
      fetch(
        `http://localhost/login-backend/Owner-management/getProject.php?id=${projectId}`
      )
        .then((response) => response.json())
        .then((data) => setProjectData(data))
        .catch((error) => console.error("Error fetching project:", error));
    } else {
      console.log("No projectId available");
    }
  }, [projectId]);

  const handleDownload = (type) => {
    if (type === "quotation") {
      if (!projectData) {
        alert("Project data not available.");
        return;
      }

      fetch(
        `http://localhost/login-backend/get_saved_quotations_by_names.php?client_name=${company}&project_name=${projectData.project_name}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            alert(data.message || "Error fetching quotation data.");
            return;
          }

          const quotation = data.quotations[0];
          if (!quotation) {
            alert("Quotation not found.");
            return;
          }

          generateQuotationPDF(quotation, company, projectData);
        })
        .catch((error) => {
          console.error("Error fetching quotation:", error);
          alert("An error occurred while generating the quotation PDF.");
        });
    } else {
      console.log(`Downloading ${type}`);
    }
  };

  const generateQuotationPDF = (quotation, company, projectData) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("SaiSamarth Polytech Pvt. Ltd.", 15, 15);
    doc.setFontSize(14);
    doc.text(`Quotation for ${projectData.project_name}`, 15, 25);

    // Quotation Details Table
    doc.autoTable({
      startY: 35,
      head: [["Client Name", "Project Name", "Date"]],
      body: [
        [company, projectData.project_name, new Date().toLocaleDateString()],
      ],
      theme: "grid",
      styles: { fontSize: 12, halign: "left" },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    // Quotation Items Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Item No.", "Description", "Quantity", "Unit", "Rate", "Amount"]],
      body: quotation.items.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        item.unit,
        Number(item.rate).toFixed(2),
        Number(item.amount).toFixed(2),
      ]),
      theme: "grid",
      styles: { fontSize: 12, halign: "center" },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    // Summary
    const taxableValue = quotation.items.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const igst = taxableValue * 0.18;
    const grandTotal = taxableValue + igst;

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Summary", "Amount"]],
      body: [
        ["Taxable Value", `${taxableValue.toFixed(2)}`],
        ["IGST (18%)", `${igst.toFixed(2)}`],
        ["Grand Total", `${grandTotal.toFixed(2)}`],
      ],
      theme: "grid",
      styles: { fontSize: 12, halign: "left" },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    // Footer
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      body: [
        ["Subject to Mumbai Jurisdiction", "For SaiSamarth Polytech Pvt. Ltd."],
        ["", "Director"],
      ],
      theme: "grid",
      styles: { fontSize: 12, halign: "left" },
      bodyStyles: { lineWidth: 0.5 },
    });
    doc.save(`Quotation_${projectData.project_name}.pdf`);
  };

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
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none mb-6"
        ></button>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Document Management System
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Manage and download your documents, including quotations, bills, and
          media files, all in one place. Stay organized and keep track of your
          important files effortlessly.
        </p>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="border-b border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Download Options
            </h2>
            {/* Date and Time Section */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-6 h-6" />
                <span className="font-medium">{currentDate}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-6 h-6" />
                <span className="font-medium">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Download Options Grid */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Quotation Download */}
              <button
                onClick={() => handleDownload("quotation")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="p-4 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quotation PDF
                  </h3>
                  <p className="text-sm text-gray-500">
                    Download your quotation as a PDF file.
                  </p>
                </div>
                <Download className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
              </button>

              {/* Bill Download */}
              <button
                onClick={() => handleDownload("bill")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Receipt className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bill PDF
                  </h3>
                  <p className="text-sm text-gray-500">
                    Download the bill for your records.
                  </p>
                </div>
                <Download className="w-6 h-6 text-gray-400 group-hover:text-green-500" />
              </button>

              {/* Media Download */}
              <div className="col-span-full flex justify-center">
                <button
                  onClick={() => handleDownload("media")}
                  className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-purple-500 hover:bg-purple-50 transition-all group w-full sm:w-auto"
                >
                  <div className="p-4 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Image className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Media Files
                    </h3>
                    <p className="text-sm text-gray-500">
                      View and download media files related to the project.
                    </p>
                  </div>
                  <Download className="w-6 h-6 text-gray-400 group-hover:text-purple-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuotationInfo;
