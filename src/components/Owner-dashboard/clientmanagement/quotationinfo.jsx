import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import {
  FileText,
  Receipt,
  Download,
  Calendar,
  Clock,
  ArrowLeft,
  ChartBar,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const QuotationInfo = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [trackRecords, setTrackRecords] = useState(null);
  const [showTrackRecords, setShowTrackRecords] = useState(false);
  const { company, projectId } = useParams();
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
    if (company) {
      fetch(
        `http://localhost/login-backend/Owner-management/getClientId.php?client_name=${encodeURIComponent(
          company
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setClientId(data.clientId);
          } else {
            console.error("Failed to fetch client ID:", data.message);
            setClientId(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching client ID:", error);
          setClientId(null);
        });
    }

    if (projectId) {
      fetch(
        `http://localhost/login-backend/Owner-management/getProjectById.php?id=${projectId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setProjectData(data);
          } else {
            console.error("Failed to fetch project:", data.message);
            setProjectData(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching project:", error);
          setProjectData(null);
        });
    }
  }, [company, projectId]);

  const handleDownload = (type) => {
    if (!projectData) {
      alert("Project data not available yet. Please wait.");
      return;
    }
    if (!clientId && type === "bill") {
      alert("Client ID not available yet. Please wait.");
      return;
    }

    if (type === "quotation") {
      fetch(
        `http://localhost/login-backend/Owner-management/get_saved_quotations_by_names.php?project_id=${projectId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.success || !data.quotations[0]) {
            alert(data.message || "No quotation found for this project.");
            return;
          }
          generateQuotationPDF(data.quotations[0]);
        })
        .catch((error) => {
          console.error("Error fetching quotation:", error);
          alert("Failed to download quotation PDF.");
        });
    } else if (type === "bill") {
      fetch(
        `http://localhost/login-backend/Owner-management/getBillData.php?clientId=${clientId}&projectId=${projectId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            alert(data.message || "No bill data found for this project.");
            return;
          }
          generateBillPDF(data);
        })
        .catch((error) => {
          console.error("Error fetching bill data:", error);
          alert("Failed to download bill PDF.");
        });
    } else if (type === "track") {
      fetch(
        `http://localhost/login-backend/get_track_records.php?project_id=${projectId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setTrackRecords(data.track_records);
            setShowTrackRecords(true);
          } else {
            alert("No track record data available.");
          }
        })
        .catch((error) => {
          console.error("Error fetching track records:", error);
          alert("Failed to fetch track record data.");
        });
    }
  };

  const handleDownloadTrackRecord = () => {
    if (!trackRecords) {
      alert("No track record data available.");
      return;
    }
    generateTrackRecordPDF(trackRecords);
  };

  const generateQuotationPDF = (quotation) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SaiSamarth Polytech Pvt. Ltd.", 15, 15);
    doc.setFontSize(14);
    doc.text(`Quotation for ${projectData.project_name}`, 15, 25);

    doc.autoTable({
      startY: 35,
      head: [["Client Name", "Project Name", "Date"]],
      body: [[company, projectData.project_name, new Date().toLocaleDateString()]],
      theme: "grid",
      styles: { fontSize: 12, halign: "left" },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

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

  const generateBillPDF = (billData) => {
    const doc = new jsPDF();

    doc.autoTable({
      head: [["SaiSamarth Polytech Pvt. Ltd.", ""]],
      body: [
        ["Project Name", billData.projectName || "Project Name"],
        ["Date", billData.date],
        ["Invoice No", billData.invoiceNo],
      ],
      theme: "grid",
      margin: { top: 20 },
      styles: {
        fontSize: 12,
        fontStyle: "bold",
        halign: "left",
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    let taxableValue = 0;
    billData.items.forEach((quotation) => {
      taxableValue += quotation.items.reduce(
        (subTotal, item) => subTotal + Number(item.total),
        0
      );
    });
    const igst = taxableValue * 0.18;
    const grandTotal = taxableValue + igst;

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Sr. No", "Description", "Quantity", "Unit", "Rate", "Total"]],
      body: billData.items.flatMap((quotation, index) =>
        quotation.items.map((item, idx) => [
          `${index + 1}.${idx + 1}`,
          item.description,
          item.quantity,
          item.unit,
          Number(item.rate).toFixed(2),
          Number(item.total).toFixed(2),
        ])
      ),
      theme: "grid",
      styles: {
        fontSize: 12,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Summary", ""]],
      body: [
        ["Taxable Value", `${taxableValue.toFixed(2)}`],
        ["IGST (18%)", `${igst.toFixed(2)}`],
        ["Grand Total", `${grandTotal.toFixed(2)}`],
      ],
      theme: "grid",
      styles: {
        fontSize: 12,
        fontStyle: "bold",
        halign: "left",
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      body: [
        ["Subject to Mumbai Jurisdiction", "For SaiSamarth Polytech Pvt. Ltd."],
        ["", "Director"],
      ],
      theme: "grid",
      styles: {
        fontSize: 12,
        fontStyle: "bold",
        halign: "left",
        cellPadding: 3,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    doc.save(`Bill_${billData.invoiceNo}.pdf`);
  };

  const generateTrackRecordPDF = async (trackRecords) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SaiSamarth Polytech Pvt. Ltd.", 15, 15);
    doc.setFontSize(14);
    doc.text(`Track Record for ${projectData.project_name}`, 15, 25);

    doc.autoTable({
      startY: 35,
      head: [["Field", "Details"]],
      body: [
        ["Status", trackRecords.status],
        [
          trackRecords.status === "Completed"
            ? "Completion Date"
            : "Last Report Date",
          trackRecords.status === "Completed" && trackRecords.date_completed
            ? new Date(trackRecords.date_completed).toLocaleDateString()
            : trackRecords.status === "In Progress" && trackRecords.created_at
            ? new Date(trackRecords.created_at).toLocaleString()
            : "N/A",
        ],
        ["Challenges", trackRecords.challenges || "N/A"],
        ["Progress Percentage", `${trackRecords.progress_percentage}%`],
        [
          "Summary of Work Completed",
          trackRecords.summary_work_completed || "N/A",
        ],
        ["Next Steps", trackRecords.next_steps || "N/A"],
        [
          "Estimated Completion Date",
          trackRecords.estimated_completion_date
            ? new Date(
                trackRecords.estimated_completion_date
              ).toLocaleDateString()
            : "N/A",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 12, halign: "left", cellPadding: 3 },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5 },
    });

    const images = [
      { src: trackRecords.image, label: "Image 1" },
      { src: trackRecords.image2, label: "Image 2" },
      { src: trackRecords.image3, label: "Image 3" },
    ].filter((img) => img.src);

    if (images.length > 0) {
      let currentY = doc.lastAutoTable.finalY + 10;
      doc.text("Images", 14, currentY);
      currentY += 10;

      for (const img of images) {
        try {
          const response = await fetch(
            `http://localhost/login-backend/get_image.php?path=${img.src}`,
            {
              mode: "cors",
              credentials: "same-origin",
            }
          );
          if (!response.ok) throw new Error(`Failed to fetch ${img.label}`);
          const imgBlob = await response.blob();
          const imgUrl = URL.createObjectURL(imgBlob);
          const imgProps = doc.getImageProperties(imgUrl);
          const imgWidth = 60;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          if (currentY + imgHeight > doc.internal.pageSize.height - 20) {
            doc.addPage();
            currentY = 20;
          }

          doc.text(img.label, 14, currentY - 2);
          doc.addImage(imgUrl, "JPEG", 14, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;
          URL.revokeObjectURL(imgUrl);
        } catch (error) {
          console.error(`Error loading ${img.label}:`, error);
          doc.text(`${img.label}: Not available`, 14, currentY);
          currentY += 10;
        }
      }
    }

    doc.save(`TrackRecord_${projectData.project_name}.pdf`);
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
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Document Management System
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Manage and download your documents, including quotations, bills, and
          track records.
        </p>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-4xl mx-auto">
          <div className="border-b border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Download Options
            </h2>
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

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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

              <button
                onClick={() => handleDownload("track")}
                className="flex items-center gap-4 p-4 md:p-6 rounded-xl border border-gray-300 hover:shadow-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="p-4 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <ChartBar className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Track Project Progress
                  </h3>
                  <p className="text-sm text-gray-500">
                    View project progress details.
                  </p>
                </div>
              </button>
            </div>

            {showTrackRecords && trackRecords && (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Track Project Progress
                </h3>
                <div className="space-y-4">
                  <p>
                    <strong>Status:</strong> {trackRecords.status}
                  </p>
                  <p>
                    <strong>
                      {trackRecords.status === "Completed"
                        ? "Completion Date"
                        : "Last Report Date"}
                      :
                    </strong>{" "}
                    {trackRecords.status === "Completed" &&
                    trackRecords.date_completed
                      ? new Date(
                          trackRecords.date_completed
                        ).toLocaleDateString()
                      : trackRecords.status === "In Progress" &&
                        trackRecords.created_at
                      ? new Date(trackRecords.created_at).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Challenges:</strong>{" "}
                    {trackRecords.challenges || "N/A"}
                  </p>
                  <div>
                    <strong>Progress Percentage:</strong>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            trackRecords.status === "Completed"
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : "bg-gradient-to-r from-orange-400 to-orange-600"
                          }`}
                          style={{
                            width: `${trackRecords.progress_percentage}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-4 text-gray-800 font-medium">
                        {trackRecords.progress_percentage}%
                      </span>
                    </div>
                  </div>
                  <p>
                    <strong>Summary of Work Completed:</strong>{" "}
                    {trackRecords.summary_work_completed || "N/A"}
                  </p>
                  <p>
                    <strong>Next Steps:</strong>{" "}
                    {trackRecords.next_steps || "N/A"}
                  </p>
                  <p>
                    <strong>Estimated Completion Date:</strong>{" "}
                    {trackRecords.estimated_completion_date
                      ? new Date(
                          trackRecords.estimated_completion_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <div>
                    <strong>Images:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      {trackRecords.image && (
                        <img
                          src={`http://localhost/login-backend/${trackRecords.image}`}
                          alt="Image 1"
                          className="max-w-full h-auto rounded-lg shadow-md"
                        />
                      )}
                      {trackRecords.image2 && (
                        <img
                          src={`http://localhost/login-backend/${trackRecords.image2}`}
                          alt="Image 2"
                          className="max-w-full h-auto rounded-lg shadow-md"
                        />
                      )}
                      {trackRecords.image3 && (
                        <img
                          src={`http://localhost/login-backend/${trackRecords.image3}`}
                          alt="Image 3"
                          className="max-w-full h-auto rounded-lg shadow-md"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleDownloadTrackRecord}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                  >
                    <Download size={16} />
                    Download Track Record
                  </button>
                  <button
                    onClick={() => setShowTrackRecords(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuotationInfo;