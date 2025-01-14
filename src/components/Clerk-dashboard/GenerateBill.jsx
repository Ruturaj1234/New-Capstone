import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerateBill = () => {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();

  const handleDownloadBill = () => {
    const doc = new jsPDF();

    // Fetch data from the backend
    fetch(`/api/get_bill_data.php?clientId=${clientId}&projectId=${projectId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Check if there's an error in the data
        if (data.error) {
          console.error('Error fetching bill data:', data.error);
          alert('Error fetching bill data. Please try again.');
          return;
        }

        // Permanent fields
        doc.setFontSize(16);
        doc.text("FDC LTD", 20, 20);
        doc.setFontSize(10);
        doc.text("Company Address", 20, 30);
        doc.text("GST No: XXXXXXXXXX", 20, 40);

        // Dynamic fields
        doc.setFontSize(12);
        doc.text(`Invoice No: ${data.invoiceNo}`, 20, 60);
        doc.text(`Date: ${data.date}`, 20, 70);
        doc.text(`Client Name: ${data.clientName}`, 20, 80);
        doc.text(`P.O. No: ${data.poNo}`, 20, 90);

        // Item table
        doc.autoTable({
          head: [['Description', 'Quantity', 'Rate', 'Total']],
          body: data.items.map(item => [item.description, item.quantity, item.rate, item.total]),
          startY: 100,
          headStyles: {
            fillColor: [22, 160, 133], // Header color
            textColor: [255, 255, 255], // White text
          },
          styles: {
            fillColor: [240, 240, 240], // Row color
            textColor: [0, 0, 0], // Black text
            halign: "center",
          },
        });

        // Totals
        doc.text(`Subtotal: ${data.subtotal}`, 20, doc.lastAutoTable.finalY + 10);
        doc.text(`IGST: ${data.igst}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text(`Total: ${data.total}`, 20, doc.lastAutoTable.finalY + 30);

        // Signature
        doc.text("Authorized Signature", 20, doc.lastAutoTable.finalY + 50);
        doc.text("Director", 20, doc.lastAutoTable.finalY + 60);

        // Save or Open PDF
        doc.save(`Bill_${data.invoiceNo}.pdf`);
      })
      .catch(error => {
        console.error('Error fetching bill data:', error);
        alert('An error occurred while fetching the bill data. Please try again.');
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
          <h4 className="text-lg font-semibold mb-2">Download Bill</h4>
          <button
            onClick={handleDownloadBill}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;