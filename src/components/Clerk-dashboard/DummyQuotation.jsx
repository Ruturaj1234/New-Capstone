import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "./Sidebar"; // Adjust the path as necessary
import { FaBars, FaPlus, FaTrash, FaFileDownload } from "react-icons/fa";
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

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.amount, 0);
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

      // Add total row
      tableRows.push(["", "", "", "Total", calculateTotal()]);

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
        <header className="bg-white/30 backdrop-blur-md p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
            >
              <FaBars size={24} />
            </button>
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto ml-4"
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:p-6">
          <div className="bg-white/30 p-4 sm:p-6 rounded-xl sm:rounded-3xl shadow-lg sm:shadow-2xl w-full max-w-4xl mx-auto mb-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              Create Quotation
            </h1>

            <form className="space-y-4 sm:space-y-6">
              {/* Company Name */}
              <div className="mb-3 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  aria-label="Company Name"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Project Name */}
              <div className="mb-3 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  aria-label="Project Name"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Products Section */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">
                  Products
                </h2>

                {products.map((product, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white/50 shadow-sm"
                  >
                    {/* Mobile layout - stacked */}
                    <div className="block sm:hidden space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm text-gray-700">
                          Product {index + 1}
                        </span>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-red-500 p-1"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>

                      {/* Product Name */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Product Name
                        </label>
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Two columns for small inputs */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Quantity
                          </label>
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            placeholder="Unit"
                            value={product.unit}
                            onChange={(e) =>
                              handleProductChange(index, "unit", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Two columns for rate and amount */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Rate
                          </label>
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            placeholder="Amount"
                            value={product.amount}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout - grid */}
                    <div className="hidden sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center">
                      {/* Product Label and Delete Button (Below Fields) */}
                      <div className="sm:col-span-6 flex justify-between items-center mt-2">
                        <span className="font-medium text-sm text-gray-700">
                          Product {index + 1}
                        </span>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-red-500 p-1"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                      {/* Product Name */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Product Name
                        </label>
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Quantity
                        </label>
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          placeholder="Unit"
                          value={product.unit}
                          onChange={(e) =>
                            handleProductChange(index, "unit", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Rate */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Rate
                        </label>
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Amount
                        </label>
                        <input
                          type="number"
                          placeholder="Amount"
                          value={product.amount}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={addProduct}
                    className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 rounded-lg shadow hover:from-orange-700 hover:to-orange-600 transition-all"
                  >
                    <FaPlus className="mr-2" size={14} /> Add Product
                  </button>

                  <button
                    type="button"
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg shadow hover:from-green-700 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileDownload className="mr-2" size={14} />
                    {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-center"
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