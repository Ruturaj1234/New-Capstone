import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // Import jsPDF

const SavedQuotation = ({ clientId, clientName, projectId, onClose }) => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost/login-backend/get_saved_quotations.php?clientId=${clientId}&projectId=${projectId}`
        );
        const data = await response.json();
        if (data.success) {
          setQuotations(data.quotations);
        } else {
          alert("Failed to fetch saved quotations: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching saved quotations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [clientId, projectId]);

  const handleSelectQuotation = (quotation) => {
    setSelectedQuotation({ ...quotation });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedQuotation((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = selectedQuotation.items.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setSelectedQuotation((prev) => ({ ...prev, items: updatedProducts }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        'http://localhost/login-backend/edit_quotation.php',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedQuotation),
        }
      );
      const data = await response.json();
      if (data.success) {
        const confirmAction = window.confirm(
          "Quotation updated successfully!"
        );
        if (confirmAction) {
          onClose(); // Close the edit form or navigate to the updated list
        }
      } else {
        alert("Failed to update quotation: " + data.message);
      }
    } catch (error) {
      console.error("Error updating quotation:", error);
    }
  };

  const handleDeleteQuotation = async (quotationId) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/login-backend/delete_quotation.php?id=${quotationId}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (data.success) {
        alert("Quotation deleted successfully!");
        setQuotations((prev) =>
          prev.filter((quotation) => quotation.id !== quotationId)
        );
      } else {
        alert("Failed to delete quotation: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting quotation:", error);
      alert("An error occurred while deleting the quotation.");
    }
  };

  // New function to generate PDF
  const handleDownloadQuotation = (quotation) => {
    const doc = new jsPDF();

    // Fetch the local image and add it to the PDF
    const imageUrl = "/image.png"; // Specify the correct relative path to the image
    const img = new Image();
    img.src = imageUrl;

    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Convert to base64
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0, 10, 210, 40); // Full width of A4 (210 units)

        // Add Quotation Details
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0); // Dark black text color
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 60);
        doc.text(`Ref. No.: ${quotation.reference_no}`, 20, 60);
        doc.text(`Address: ${quotation.address}`, 20, 70);
        doc.text(`Kind Attention: ${quotation.name}`, 20, 80);
        doc.text(`Sub: ${quotation.subject}`, 20, 90);

        // Add Body Text
        doc.setFontSize(10);
        doc.text("Respected Sir,", 20, 100);
        doc.text(
            "With reference to the above, we take pleasure in offering our services for carrying out the work as follows:",
            20,
            110
        );

        let currentY = 120; // Start Y position for the first product

        // Loop through each product to create a section for it
        quotation.items.forEach((product, index) => {
            // Add Product Name and Description
            doc.setFontSize(12);
            doc.setTextColor(0); // Dark text color
            doc.text(`Product ${index + 1}: ${product.product_name}`, 20, currentY); // Corrected string interpolation
            currentY += 10;

            doc.setFontSize(10);
            doc.text(`Description: ${product.description}`, 20, currentY);
            currentY += 10;

            doc.text(`Old PO: ${product.old_po}`, 20, currentY);
            currentY += 10;

            // Create a table for the current product's details
            const productRows = [
                [product.quantity, product.unit, product.rate, product.amount],
            ];

            // Generate autoTable for the product with custom styles
            doc.autoTable({
                head: [["Quantity", "Unit", "Rate", "Amount"]],
                body: productRows,
                startY: currentY,
                theme: "grid",
                headStyles: {
                    fillColor: [22, 160, 133], // Header color
                    textColor: [255, 255, 255], // White text color
                    fontSize: 10,
                    font: "bold",
                    halign: "center",
                },
                styles: {
                    fillColor: [240, 240, 240], // Light gray rows
                    textColor: [0, 0, 0], // Black text color
                    fontSize: 10,
                    halign: "center",
                    cellPadding: 2,
                    lineColor: [0, 0, 0],
                    lineWidth: 0.75,
                },
            });

            // Update currentY for the next product section
            currentY = doc.lastAutoTable.finalY + 10;
        });

        // Add Footer Information
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(
            "TAXATION: IGST @ 18% on Total Contract Value.",
            20,
            currentY + 10
        );
        doc.text(
            "TRANSPORTATION: Transport Cost will be charged extra along with IGST@18%.",
            20,
            currentY + 20
        );
        doc.text(
            "PAYMENT TERM: Within 15 Days of Submission of Bill.",
            20,
            currentY + 30
        );

        // Page 2 for Terms & Conditions
        doc.addPage();
        doc.text("Continuing Sheet …2", 20, 20);
        doc.setFontSize(12);
        doc.text("TERMS & CONDITIONS:", 20, 30);

        // Add Terms & Conditions
        doc.setFontSize(10);
        const terms = [
            "1. The above rates include material and application charges.",
            "2. The above rate is worked out on the basis of standard consumption of products, considering a properly leveled wall surface. Any extra material consumed shall be ordered extra at per KG rate.",
            "3. ESIC – We are registered Under ESIC Act 1948, ESIC Code No. 34000269260000999.",
            "4. Provident Fund – We are registered Under EPF Act 1952, EPF Code No. MH/THN/204512.",
            "5. Any changes in taxes levied by the Government at the time of delivery of material and execution of work will be applicable at actual.",
            "6. You will provide 3-phase electricity, water, and proper lighting arrangement at the work site free of cost.",
            "7. Sufficient space in the company premises for storing material must be provided.",
            "8. Any localized repairs required on the wall surface shall be done by you.",
        ];

        let termY = 40;
        terms.forEach((term, index) => {
            doc.setFont("helvetica", "bold"); // Serial number bold
            doc.text(`${index + 1}.`, 20, termY); // Corrected string interpolation
            doc.setFont("helvetica", "normal"); // Text regular
            doc.text(term.slice(3), 25, termY); // Skip serial number in the text
            termY += 10;
        });

        // Signature Section
        doc.setFont("helvetica", "bold");
        doc.text(
            "Hope you will find our offer in line with your requirements.",
            20,
            termY + 20
        );
        doc.text("Thanking you, Cordially,", 20, termY + 30);
        doc.text("For, Sai Samarth Polytech Pvt. Ltd.", 20, termY + 40);
        doc.text("Atulkumar Patil – Director (09324529411)", 20, termY + 50);

        // Save or Open PDF
        doc.save(`Quotation_${quotation.reference_no}.pdf`);
    };

    // Handle image load error
    img.onerror = function () {
        console.error("Error loading image");
    };
  };

  if (loading) {
    return <div>Loading saved quotations...</div>;
  }

  if (quotations.length === 0) {
    return <div>No quotation found for {clientName}.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Saved Quotations</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Reference No</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation) => (
            <tr key={quotation.id} className="hover:bg-gray-100 transition-colors">
              <td className="border border-gray-300 px-4 py-2">{quotation.reference_no}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(quotation.created_at).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleSelectQuotation(quotation)}
                  className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuotation(quotation.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleDownloadQuotation(quotation)} // Pass the entire quotation
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedQuotation && (
        <div className="bg-gray-100 p-6 min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
            <header className="flex items-center mb-4">
              <button onClick={onClose} className="text-gray-700 font-semibold">
                &larr; Back
              </button>
              <h2 className="text-2xl font-bold text-center flex-grow">Edit Quotation</h2>
            </header>

            <form className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <label className="flex-1">
                  Reference No:
                  <input
                    type="text"
                    name="reference_no"
                    value={selectedQuotation.reference_no}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </label>
                <label className="flex-1">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={selectedQuotation.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </label>
              </div>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={selectedQuotation.address}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </label>
              <label>
                Subject:
                <input
                  type="text"
                  name="subject"
                  value={selectedQuotation.subject}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </label>

              <h4 className="text-lg font-semibold mt-4">Products</h4>
              {selectedQuotation.items.map((product, index) => (
  <div key={index} className="border border-gray-300 p-4 rounded mb-2">
    <div className="flex flex-col space-y-2">
      <label>
        Product Name:
        <input
          type="text"
          value={product.product_name}
          onChange={(e) =>
            handleProductChange(index, "product_name", e.target.value)
          }
          className="border border-gray-300 rounded p-2 w-full"
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={product.description}
          onChange={(e) =>
            handleProductChange(index, "description", e.target.value)
          }
          className="border border-gray-300 rounded p-2 w-full"
        />
      </label>
      <label>
        Old PO:
        <input
          type="text"
          value={product.old_po}
          onChange={(e) =>
            handleProductChange(index, "old_po", e.target.value)
          }
          className="border border-gray-300 rounded p-2 w-full"
        />
      </label>
      
      {/* Fields for Qty, Unit, Rate, Amount */}
      <div className="flex space-x-4">
        <div className="w-1/4">
          <label>Qty:</label>
          <input
            type="number"
            value={product.quantity}
            onChange={(e) =>
              handleProductChange(index, "quantity", e.target.value)
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="w-1/4">
          <label>Unit:</label>
          <input
            type="text"
            value={product.unit}
            onChange={(e) =>
              handleProductChange(index, "unit", e.target.value)
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="w-1/4">
          <label>Rate:</label>
          <input
            type="number"
            value={product.rate}
            onChange={(e) =>
              handleProductChange(index, "rate", e.target.value)
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="w-1/4">
          <label>Amount:</label>
          <input
            type="number"
            value={product.amount}
            onChange={(e) =>
              handleProductChange(index, "amount", e.target.value)
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
      </div>
    </div>
  </div>
))}

              <button
                type="button"
                onClick={handleSaveChanges}
                className="bg-blue-600 text-white rounded px-4 py-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedQuotation;
