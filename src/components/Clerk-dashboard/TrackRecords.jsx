import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logoImage from "/image.png"; // Adjusted to root of public folder

const TrackRecords = ({ onClose }) => {
  const { clientId, projectId } = useParams();

  const [trackRecords, setTrackRecords] = useState({
    challenges: "",
    progress_percentage: 0,
    image: "",
    image2: "",
    image3: "",
    status: "Not Assigned Yet",
    created_at: "",
    date_completed: "",
    summary_work_completed: "",
    next_steps: "",
    estimated_completion_date: ""
  });

  useEffect(() => {
    const fetchTrackRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost/login-backend/get_track_records.php?project_id=${projectId}`
        );
        const data = await response.json();
        if (data.success) {
          setTrackRecords(data.track_records);
        } else {
          console.error("Failed to fetch track records:", data.message);
        }
      } catch (error) {
        console.error("Error fetching track records:", error);
      }
    };

    fetchTrackRecords();
  }, [projectId]);

  const progressBarColor = trackRecords.progress_percentage === 100 ? "bg-green-500" : "bg-blue-500";
  
  const displayDate = trackRecords.status === "Completed" && trackRecords.date_completed
    ? new Date(trackRecords.date_completed).toLocaleDateString()
    : trackRecords.status === "In Progress" && trackRecords.created_at
    ? new Date(trackRecords.created_at).toLocaleString()
    : "N/A";

  const estimatedCompletionDate = trackRecords.estimated_completion_date
    ? new Date(trackRecords.estimated_completion_date).toLocaleDateString()
    : "N/A";

  const handleDownloadReport = async () => {
    const doc = new jsPDF();

    // Add logo to header
    const img = new Image();
    img.src = logoImage;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => {
        console.error("Failed to load logo image");
        resolve(); // Continue even if logo fails
      };
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 20, 10, 60, 30); // Logo at top-left

    // Header Table
    doc.autoTable({
      head: [["SaiSamarth Polytech Pvt. Ltd.", ""]],
      body: [
        ["Project ID", projectId],
        ["Client ID", clientId],
        ["Status", trackRecords.status],
        [trackRecords.status === "Completed" ? "Completion Date" : "Last Report Date", displayDate]
      ],
      theme: "grid",
      margin: { top: 50 },
      styles: { fontSize: 12, fontStyle: "bold", halign: "left", cellPadding: 3 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5 },
      bodyStyles: { lineWidth: 0.5 },
    });

    // Track Records Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Field", "Details"]],
      body: [
        ["Challenges", trackRecords.challenges || "N/A"],
        ["Progress Percentage", `${trackRecords.progress_percentage}%`],
        ["Summary of Work Completed", trackRecords.summary_work_completed || "N/A"],
        ["Next Steps", trackRecords.next_steps || "N/A"],
        ["Estimated Completion Date", estimatedCompletionDate]
      ],
      theme: "grid",
      styles: { fontSize: 12, halign: "left", cellPadding: 3 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5 },
      bodyStyles: { lineWidth: 0.5 },
    });

    // Images Section
    const images = [
      { src: trackRecords.image, label: "Image 1" },
      { src: trackRecords.image2, label: "Image 2" },
      { src: trackRecords.image3, label: "Image 3" }
    ].filter(img => img.src);

    if (images.length > 0) {
      let currentY = doc.lastAutoTable.finalY + 10;
      doc.text("Images", 14, currentY);
      currentY += 10;

      for (const img of images) {
        try {
          const response = await fetch(`http://localhost/login-backend/get_image.php?path=${img.src}`, {
            mode: 'cors',
            credentials: 'same-origin'
          });
          if (!response.ok) throw new Error(`Failed to fetch ${img.label}: ${response.statusText}`);
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
          URL.revokeObjectURL(imgUrl); // Clean up
        } catch (error) {
          console.error(`Error loading ${img.label}:`, error);
          doc.text(`${img.label}: Not available`, 14, currentY);
          currentY += 10;
        }
      }
    }

    // Save PDF
    doc.save(`TrackRecord_${projectId}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl mt-6">
      <header className="flex items-center justify-between mb-4">
        <button onClick={() => onClose()} className="text-gray-700">
          ← Back
        </button>
        <h2 className="text-2xl font-bold mx-auto">Track Records</h2>
      </header>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">
          Project ID: <span className="text-gray-600">{projectId}</span>
        </h3>
        <h4 className="text-lg text-gray-500">Client ID: {clientId}</h4>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Project Status</h4>
          <button
            onClick={handleDownloadReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Download Report
          </button>
        </div>
        <div className="space-y-4">
          <p>
            <strong>Status:</strong>{" "}
            <span className={`font-medium ${trackRecords.status === "Completed" ? "text-green-600" : trackRecords.status === "In Progress" ? "text-blue-600" : "text-gray-600"}`}>
              {trackRecords.status}
            </span>
          </p>
          <p>
            <strong>{trackRecords.status === "Completed" ? "Completion Date" : "Last Report Date"}:</strong>{" "}
            <span className="text-gray-600">{displayDate}</span>
          </p>
          <p>
            <strong>Challenges:</strong>{" "}
            <span className="text-gray-600">{trackRecords.challenges || "N/A"}</span>
          </p>
          <div>
            <strong>Progress Percentage:</strong>
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`${progressBarColor} h-4 rounded-full`}
                  style={{ width: `${trackRecords.progress_percentage}%` }}
                ></div>
              </div>
              <span className="ml-4 text-gray-800 font-medium">{trackRecords.progress_percentage}%</span>
            </div>
          </div>
          <p>
            <strong>Summary of Work Completed:</strong>{" "}
            <span className="text-gray-600">{trackRecords.summary_work_completed || "N/A"}</span>
          </p>
          <p>
            <strong>Next Steps:</strong>{" "}
            <span className="text-gray-600">{trackRecords.next_steps || "N/A"}</span>
          </p>
          <p>
            <strong>Estimated Completion Date:</strong>{" "}
            <span className="text-gray-600">{estimatedCompletionDate}</span>
          </p>
          <div>
            <strong>Images:</strong>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {trackRecords.image ? (
                <img
                  src={`http://localhost/login-backend/${trackRecords.image}`}
                  alt="Project Image 1"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <p className="text-gray-600">No image available</p>
              )}
              {trackRecords.image2 ? (
                <img
                  src={`http://localhost/login-backend/${trackRecords.image2}`}
                  alt="Project Image 2"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <p className="text-gray-600">No image available</p>
              )}
              {trackRecords.image3 ? (
                <img
                  src={`http://localhost/login-backend/${trackRecords.image3}`}
                  alt="Project Image 3"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <p className="text-gray-600">No image available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRecords;