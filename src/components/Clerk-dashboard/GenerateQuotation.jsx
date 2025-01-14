import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerateQuotation = () => {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();

  const [quotationData, setQuotationData] = useState({
    referenceNo: "",
    address: "",
    name: "",
    subject: "",
    products: [{ productName: "", description: "", oldPO: "", qty: "", unit: "", rate: "", amount: "" }],
  });

  // Add Product Handler
  const handleAddProduct = () => {
    setQuotationData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        { productName: "", description: "", oldPO: "", qty: "", unit: "", rate: "", amount: "" },
      ],
    }));
  };

  // Product Change Handler
  const handleProductChange = (index, field, value) => {
    setQuotationData((prevData) => {
      const newProducts = [...prevData.products];
      newProducts[index][field] = value;

      // Calculate amount based on qty and rate
      if (field === "qty" || field === "rate") {
        const qty = parseFloat(newProducts[index].qty) || 0;
        const rate = parseFloat(newProducts[index].rate) || 0;
        newProducts[index].amount = qty * rate;
      }

      return { ...prevData, products: newProducts };
    });
  };

  // Generic Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save Quotation to Backend
  const handleSaveQuotation = () => {
    const url = 'http://localhost/login-backend/add_quotation.php'; // Replace with your PHP API URL

    const payload = {
      referenceNo: quotationData.referenceNo,
      address: quotationData.address,
      name: quotationData.name,
      subject: quotationData.subject,
      clientId,
      projectId,
      products: quotationData.products, // Change from 'products' to 'items'
    };


  // Basic validation
  if (!payload.referenceNo || !payload.name || !payload.subject || !payload.address) {
    alert("Please fill in all required fields (Reference No, Name, Subject, Address).");
    return;
  }

  if (payload.products.some((product) => !product.productName || !product.qty || !product.rate)) {
    alert("Each product must have a name, quantity, and rate.");
    return;
  }



    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          alert('Quotation saved successfully!');
        } else {
          alert('Failed to save quotation. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while saving the quotation.');
      });
  };

  const handleDownloadQuotation = () => {
    const doc = new jsPDF();

    // Fetch the local image and add it to the PDF
    const imageUrl = '/public/image.png'; // Specify the correct relative path to the image
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

      // Add the base64 image to jsPDF
      doc.addImage(imgData, "PNG", 20, 10, 60, 30); // Adjust x, y, width, height

      // Add Quotation Details
      doc.setFontSize(12);
      doc.setTextColor(40); // Dark text color
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 50);
      doc.text(`Ref. No.: ${quotationData.referenceNo}`, 20, 50);
      doc.text(`Address: ${quotationData.address}`, 20, 60);
      doc.text(`Kind Attention: ${quotationData.name}`, 20, 70);
      doc.text(`Sub: ${quotationData.subject}`, 20, 80);

      // Add Body Text
      doc.setFontSize(10);
      doc.text("Respected Sir,", 20, 90);
      doc.text("With reference to the above, we take pleasure in offering our services for carrying out the work as follows:", 20, 100);

      // Initialize currentY for positioning
      let currentY = 110; // Start Y position for the first product

      // Loop through each product to create a section for it
      quotationData.products.forEach((product, index) => {
        // Add Product Name and Description
        doc.setFontSize(12);
        doc.setTextColor(40); // Dark text color
        doc.text(`Product ${index + 1}: ${product.productName}`, 20, currentY);
        currentY += 10; // Move down for the next line

        doc.setFontSize(10);
        doc.text(`Description: ${product.description}`, 20, currentY);
        currentY += 10; // Move down for the next line

        doc.text(`Old PO: ${product.oldPO}`, 20, currentY);
        currentY += 10; // Move down for the next line

        // Create a table for the current product's details
        const productRows = [
          [product.qty, product.unit, product.rate, product.amount],
        ];

        // Generate autoTable for the product with custom styles
        doc.autoTable({
          head: [["Qty", "Unit", "Rate", "Amount"]],
          body: productRows,
          startY: currentY,
          theme: 'grid',
          headStyles: {
            fillColor: [22, 160, 133], // Change header color
            textColor: [255, 255, 255], // White text color
            fontSize: 10,
            font: "bold",
            halign: "center",
          },
          styles: {
            fillColor: [240, 240, 240], // Light gray color for rows
            textColor: [0, 0, 0], // Black text color
            fontSize: 10,
            halign: "center",
            cellPadding: 2,
            lineColor: [0, 0, 0],
            lineWidth: 0.75,
          },
        });

        // Update currentY for the next product section
        currentY = doc.lastAutoTable.finalY + 10; // Move down after the table
      });

      // Add Footer Information
      doc.setFontSize(10);
      doc.setTextColor(40); // Dark text color
      doc.text("TAXATION: IGST @ 18% on Total Contract Value.", 20, currentY + 10);
      doc.text("TRANSPORTATION: Transport Cost will be charged extra along with IGST@18%.", 20, currentY + 20);
      doc.text("PAYMENT TERM: Within 15 Days of Submission of Bill.", 20, currentY + 30);

      // Page 2 for Terms & Conditions
      doc.addPage();
      doc.text("Continuing Sheet …2", 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(40); // Dark text color
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
      terms.forEach((term) => {
        doc.text(term, 20, termY);
        termY += 10;
      });

      // Signature
      doc.text("Hope you will find our offer in line with your requirements.", 20, termY + 20);
      doc.text("Thanking you, Cordially,", 20, termY + 30);
      doc.text("For, Sai Samarth Polytech Pvt. Ltd.", 20, termY + 40);
      doc.text("Atulkumar Patil – Director (09324529411)", 20, termY + 50);

      // Save or Open PDF
      doc.save(`Quotation_${quotationData.referenceNo}.pdf`);
    };

    // Handle image load error
    img.onerror = function () {
      console.error('Error loading image');
    };
  };

  return (
    
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <header className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 font-semibold">
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold text-center flex-grow">Generate Quotation</h2>
        </header>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Project ID: <span className="text-gray-600">{projectId}</span>
          </h3>
          <h4 className="text-lg text-gray-500">Client ID: {clientId}</h4>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <h4 className="text-lg font-semibold mb-2">Quotation Details</h4>
          <form className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <label className="flex-1">
                Reference No:
                <input
                  type="text"
                  name="referenceNo"
                  value={quotationData.referenceNo}
                  onChange={handleInputChange}
                  placeholder="Enter reference number"
                  className="border border-gray-300 rounded p-2 w-full"
                  required // Added required attribute for better UX
                />
              </label>
              <label className="flex-1">
                Name:
                <input
                  type="text"
                  name="name"
                  value={quotationData.name}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  className="border border-gray-300 rounded p-2 w-full"
                  required // Added required attribute for better UX
                />
              </label>
            </div>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={quotationData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="border border-gray-300 rounded p-2 w-full"
                required // Added required attribute for better UX
              />
            </label>
            <label>
              Subject:
              <input
                type="text"
                name="subject"
                value={quotationData.subject}
                onChange={handleInputChange}
                placeholder="Enter subject"
                className="border border-gray-300 rounded p-2 w-full"
              />
            </label>

            <h4 className="text-lg font-semibold mt-4">Products</h4>
            {quotationData.products.map((product, index) => (
              <div key={index} className="border border-gray-300 p-4 rounded mb-2">
                <div className="flex flex-col space-y-2">
                  <label>
                    Product Name:
                    <input
                      type="text"
                      value={product.productName}
                      onChange={(e) => handleProductChange(index, "productName", e.target.value)}
                      placeholder="Enter product name"
                      className="border border-gray-300 rounded p-2 w-full"
                      required // Added required attribute for better UX
                    />
                  </label>
                  <label>
                    Description:
                    <input
                      type="text"
                      value={product.description}
                      onChange={(e) => handleProductChange(index, "description", e.target.value)}
                      placeholder="Enter description"
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </label>
                  <label>
                    Old PO:
                    <input
                      type="text"
                      value={product.oldPO}
                      onChange={(e) => handleProductChange(index, "oldPO", e.target.value)}
                      placeholder="Enter old PO"
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex-1">
                      Qty:
                      <input
                        type="number"
                        value={product.qty}
                        onChange={(e) => handleProductChange(index, "qty", e.target.value)}
                        placeholder="Enter quantity"
                        className="border border-gray-300 rounded p-2 w-full"
                        min="0"
                      />
                    </label>
                    <label className="flex-1">
                      Unit:
                      <input
                        type="text"
                        value={product.unit}
                        onChange={(e) => handleProductChange(index, "unit", e.target.value)}
                        placeholder="Enter unit"
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </label>
                    <label className="flex-1">
                      Rate:
                      <input
                        type="number"
                        value={product.rate}
                        onChange={(e) => handleProductChange(index, "rate", e.target.value)}
                        placeholder="Enter rate"
                        className="border border-gray-300 rounded p-2 w-full"
                        min="0"
                      />
                    </label>
                    <label className="flex-1">
                      Amount:
                      <input
                        type="number"
                        value={product.amount}
                        readOnly // Amount is calculated automatically
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Product
            </button>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleDownloadQuotation}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={handleSaveQuotation}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Save Quotation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuotation;