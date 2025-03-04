import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Pencil, Trash2, Download, ChevronLeft, Save, Plus } from "lucide-react";

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
    setSelectedQuotation({ ...quotation, items: quotation.items || [] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedQuotation((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    if (!selectedQuotation || !selectedQuotation.items) return;
    const updatedProducts = selectedQuotation.items.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setSelectedQuotation((prev) => ({ ...prev, items: updatedProducts }));
  };

  const handleRemoveProduct = (index) => {
    if (!selectedQuotation || !selectedQuotation.items) return;
    const updatedProducts = selectedQuotation.items.filter((_, i) => i !== index);
    setSelectedQuotation((prev) => ({ ...prev, items: updatedProducts }));
  };

  const handleAddProduct = () => {
    if (!selectedQuotation || !selectedQuotation.items) return;
    const newProduct = {
      product_name: "",
      description: "",
      old_po: "",
      quantity: "",
      unit: "",
      rate: "",
      amount: "",
    };
    setSelectedQuotation((prev) => ({
      ...prev,
      items: [...prev.items, newProduct],
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const payload = {
        id: selectedQuotation.id,
        reference_no: selectedQuotation.reference_no,
        name: selectedQuotation.name,
        address: selectedQuotation.address,
        subject: selectedQuotation.subject,
        products: selectedQuotation.items, // Match backend expectation
      };
      console.log("Sending payload:", payload);

      const response = await fetch("http://localhost/login-backend/edit_quotation.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Response from backend:", data);

      if (data.success) {
        const confirmAction = window.confirm("Quotation updated successfully!");
        if (confirmAction) {
          setQuotations((prev) =>
            prev.map((q) => (q.id === selectedQuotation.id ? { ...q, ...payload } : q))
          );
          onClose();
        }
      } else {
        alert("Failed to update quotation: " + data.message);
      }
    } catch (error) {
      console.error("Error updating quotation:", error);
      alert("An error occurred while updating the quotation.");
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

  const handleDownloadQuotation = (quotation) => {
    const doc = new jsPDF();
    const imageUrl = "/image.png";
    const img = new Image();
    img.src = imageUrl;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 0, 10, 210, 40);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 60);
      doc.text(`Ref. No.: ${quotation.reference_no}`, 20, 60);
      doc.text(`Address: ${quotation.address}`, 20, 70);
      doc.text(`Kind Attention: ${quotation.name}`, 20, 80);
      doc.text(`Sub: ${quotation.subject}`, 20, 90);

      doc.setFontSize(10);
      doc.text("Respected Sir,", 20, 100);
      doc.text(
        "With reference to the above, we take pleasure in offering our services for carrying out the work as follows:",
        20,
        110
      );

      let currentY = 120;
      quotation.items.forEach((product, index) => {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Product ${index + 1}: ${product.product_name}`, 20, currentY);
        currentY += 10;

        doc.setFontSize(10);
        doc.text(`Description: ${product.description}`, 20, currentY);
        currentY += 10;
        doc.text(`Old PO: ${product.old_po}`, 20, currentY);
        currentY += 10;

        const productRows = [
          [product.quantity, product.unit, product.rate, product.amount],
        ];

        doc.autoTable({
          head: [["Quantity", "Unit", "Rate", "Amount"]],
          body: productRows,
          startY: currentY,
          theme: "grid",
          headStyles: {
            fillColor: [22, 160, 133],
            textColor: [255, 255, 255],
            fontSize: 10,
            font: "bold",
            halign: "center",
          },
          styles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontSize: 10,
            halign: "center",
            cellPadding: 2,
            lineColor: [0, 0, 0],
            lineWidth: 0.75,
          },
        });

        currentY = doc.lastAutoTable.finalY + 10;
      });

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text("TAXATION: IGST @ 18% on Total Contract Value.", 20, currentY + 10);
      doc.text(
        "TRANSPORTATION: Transport Cost will be charged extra along with IGST@18%.",
        20,
        currentY + 20
      );
      doc.text("PAYMENT TERM: Within 15 Days of Submission of Bill.", 20, currentY + 30);

      doc.addPage();
      doc.text("Continuing Sheet …2", 20, 20);
      doc.setFontSize(12);
      doc.text("TERMS & CONDITIONS:", 20, 30);

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
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}.`, 20, termY);
        doc.setFont("helvetica", "normal");
        doc.text(term.slice(3), 25, termY);
        termY += 10;
      });

      doc.setFont("helvetica", "bold");
      doc.text("Hope you will find our offer in line with your requirements.", 20, termY + 20);
      doc.text("Thanking you, Cordially,", 20, termY + 30);
      doc.text("For, Sai Samarth Polytech Pvt. Ltd.", 20, termY + 40);
      doc.text("Atulkumar Patil – Director (09324529411)", 20, termY + 50);

      doc.save(`Quotation_${quotation.reference_no}.pdf`);
    };

    img.onerror = function () {
      console.error("Error loading image");
    };
  };

  if (loading) {
    return <div className="text-gray-600">Loading saved quotations...</div>;
  }

  if (quotations.length === 0) {
    return <div className="text-gray-600">No quotation found for {clientName}.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Saved Quotations</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-gray-700">Reference No</th>
            <th className="border border-gray-300 px-4 py-2 text-gray-700">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation) => (
            <tr key={quotation.id} className="hover:bg-gray-100 transition-colors">
              <td className="border border-gray-300 px-4 py-2">{quotation.reference_no}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(quotation.created_at).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleSelectQuotation(quotation)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuotation(quotation.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={() => handleDownloadQuotation(quotation)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
                >
                  <Download size={16} />
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
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1 rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <h2 className="text-2xl font-bold text-center flex-grow text-gray-800">Edit Quotation</h2>
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

              <h4 className="text-lg font-semibold mt-4 text-gray-700">Products</h4>
              {selectedQuotation.items && selectedQuotation.items.map((product, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded mb-2 relative">
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
                  {selectedQuotation.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-1 text-sm font-semibold"
              >
                <Plus size={16} />
                Add Product
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-1 justify-center text-sm font-semibold"
              >
                <Save size={16} />
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