import React, { useState, useEffect } from "react";

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
        `http://localhost/login-backend/edit_quotation.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedQuotation),
        }
      );
      const data = await response.json();
      if (data.success) {
        const confirmAction = window.confirm(
          "Quotation updated successfully! Do you want to view the updated list?"
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
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
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
                    <div className="flex space-x-4">
                      <label className="flex-1">
                        Quantity:
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            handleProductChange(index, "quantity", e.target.value)
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </label>
                      <label className="flex-1">
                        Unit:
                        <input
                          type="text"
                          value={product.unit}
                          onChange={(e) =>
                            handleProductChange(index, "unit", e.target.value)
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </label>
                      <label className="flex-1">
                        Rate:
                        <input
                          type="number"
                          value={product.rate}
                          onChange={(e) =>
                            handleProductChange(index, "rate", e.target.value)
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </label>
                      <label className="flex-1">
                        Amount:
                        <input
                          type="number"
                          value={product.amount}
                          onChange={(e) =>
                            handleProductChange(index, "amount", e.target.value)
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </form>
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 text-white px-4 py-2 rounded mt-4"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedQuotation;
