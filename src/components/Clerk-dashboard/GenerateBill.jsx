import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerateBill = () => {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDownloadBill = () => {
    const doc = new jsPDF();
  
    // Fetch data from the backend
    fetch(`http://localhost/login-backend/get_bill_data.php?clientId=${clientId}&projectId=${projectId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          alert(data.message || "Error fetching data");
          return;
        }
  
        let taxableValue = 0;
  
        // Header Table
        doc.autoTable({
          head: [["SaiSamarth Polytech Pvt. Ltd.", ""]],
          body: [
            ["Project Name", data.projectName || "Project Name"],
            ["Date", data.date],
            ["Invoice No", data.invoiceNo],
          ],
          theme: "grid", // Black border for the table
          margin: { top: 20 },
          styles: { fontSize: 12, fontStyle: "bold", halign: "left", cellPadding: 3 },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5 },
          bodyStyles: { lineWidth: 0.5 },
        });
  
        // Table for Items
        taxableValue = data.items.reduce((total, quotation) => {
          return (
            total +
            quotation.items.reduce((subTotal, item) => subTotal + Number(item.total), 0)
          );
        }, 0);
  
        const igst = Number(taxableValue) * 0.18;
        const grandTotal = Number(taxableValue) + igst;
  
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 10,
          head: [["Sr. No", "Description", "Quantity", "Unit", "Rate", "Total"]],
          body: data.items.flatMap((quotation, index) =>
            quotation.items.map((item, idx) => [
              `${index + 1}.${idx + 1}`,
              item.description,
              item.quantity,
              item.unit,
              Number(item.rate).toFixed(2),
              Number(item.total).toFixed(2),
            ])
          ),
          theme: "grid", // Black border for the table
          styles: { fontSize: 12, fontStyle: "bold", halign: "center", cellPadding: 3 },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5 },
          bodyStyles: { lineWidth: 0.5 },
        });
  
        // Summary Table
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 10,
          head: [["Summary", ""]],
          body: [
            ["Taxable Value", `${taxableValue.toFixed(2)}`],
            ["IGST (18%)", `${igst.toFixed(2)}`],
            ["Grand Total", `${grandTotal.toFixed(2)}`],
          ],
          theme: "grid", // Black border for the table
          styles: { fontSize: 12, fontStyle: "bold", halign: "left", cellPadding: 3 },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5 },
          bodyStyles: { lineWidth: 0.5 },
        });
  
        // Footer Table
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 20,
          body: [
            [
              "Subject to Mumbai Jurisdiction",
              "For SaiSamarth Polytech Pvt. Ltd.",
            ],
            ["", "Director"],
          ],
          theme: "grid", // Black border for the table
          styles: { fontSize: 12, fontStyle: "bold", halign: "left", cellPadding: 3 },
          bodyStyles: { lineWidth: 0.5 },
        });
  
        // Save PDF
        doc.save(`Bill_${data.invoiceNo}.pdf`);
      })
      .catch((error) => {
        console.error("Error fetching bill data:", error);
        alert("An error occurred while fetching the bill data. Please try again.");
      });
  };
  

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <header className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 font-semibold">
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold text-center flex-grow">Generate Bill</h2>
        </header>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Project ID: <span className="text-gray-600">{projectId}</span>
          </h3>
          <h4 className="text-lg text-gray-500">Client ID: {clientId}</h4>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <h4 className="text-lg font-semibold mb-2">Generate PDF</h4>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Generate PDF
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Confirmation</h3>
            <p className="text-gray-600 mb-6">
              Once the bill is generated, you cannot make changes. Do you wish to proceed?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleDownloadBill();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateBill;