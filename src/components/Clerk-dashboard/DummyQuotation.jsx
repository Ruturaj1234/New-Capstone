/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "./Sidebar"; // Adjust the path as necessary
import { FaBars } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DummyQuotation = () => {
  const [companyName, setCompanyName] = useState(
    "Saisamarth Polytech Pvt. Ltd."
  );
  const [projectName, setProjectName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([
    { productName: "", qty: 0, unit: "", rate: 0, amount: 0 },
  ]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    if (field === "qty" || field === "rate") {
      updatedProducts[index].amount =
        updatedProducts[index].qty * updatedProducts[index].rate;
    }
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { productName: "", qty: 0, unit: "", rate: 0, amount: 0 },
    ]);
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF();
    const img = new Image();
    img.src = "/image.png"; // Use the correct path for your logo or image

    img.onload = () => {
      const pageWidth = doc.internal.pageSize.width;
      const imgWidth = pageWidth;
      const imgHeight = (img.height / img.width) * imgWidth;

      // Add the image to the PDF
      doc.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);

      // Header text
      const headerYPosition = imgHeight + 10;
      doc.setFontSize(18);
      doc.text(companyName, 10, headerYPosition);
      doc.setFontSize(14);
      doc.text(`Project: ${projectName}`, 10, headerYPosition + 10);

      // Table columns and rows
      const tableColumn = ["Product Name", "Qty", "Unit", "Rate", "Amount"];
      const tableRows = products.map((product) => [
        product.productName,
        product.qty,
        product.unit,
        product.rate,
        product.amount,
      ]);

      // Add table to the PDF
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: headerYPosition + 20,
      });

      // Footer text
      const tableEndY = doc.lastAutoTable.finalY; // Get the last table Y position
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Set bold font for Terms & Conditions
      doc.text("Terms & Conditions:", 10, tableEndY + 10);

      // Reset font to normal for the terms content
      doc.setFont("helvetica", "normal");
      doc.text(
        "1. The prices are valid for 30 days from the date of quotation.",
        10,
        tableEndY + 20
      );
      doc.text(
        "2. Taxes, duties, and freight are not included unless specified.",
        10,
        tableEndY + 30
      );

      // Signature Section
      const termY = tableEndY + 40;
      doc.setFont("helvetica", "bold");
      doc.text(
        "Hope you will find our offer in line with your requirements.",
        20,
        termY + 20
      );
      doc.text("Thanking you, Cordially,", 20, termY + 30);
      doc.text("For, Sai Samarth Polytech Pvt. Ltd.", 20, termY + 40);
      doc.text("Atulkumar Patil – Director (09324529411)", 20, termY + 50);

      // Save the PDF
      doc.save("quotation.pdf");
      setIsGeneratingPDF(false);
      toast.success("PDF downloaded successfully!"); // Success toast
    };

    img.onerror = () => {
      console.error(
        "Failed to load the image. Ensure the image path is correct."
      );
      setIsGeneratingPDF(false);
      toast.error("Failed to generate PDF. Please try again."); // Error toast
    };
  };

  return (
    <div className="flex h-screen bg-gray-100 font-poppins">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto mr-4"
            />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Company Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Project Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Products Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Products</h2>
              {products.map((product, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={product.productName}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "productName",
                          e.target.value
                        )
                      }
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={product.qty}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "qty",
                          Number(e.target.value)
                        )
                      }
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={product.unit}
                      onChange={(e) =>
                        handleProductChange(index, "unit", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={product.rate}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "rate",
                          Number(e.target.value)
                        )
                      }
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={product.amount}
                      readOnly
                      className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addProduct}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
              >
                Add Product
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default DummyQuotation;
