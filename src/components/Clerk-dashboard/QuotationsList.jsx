import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QuotationsList = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    // Load saved quotations from backend
    const url = 'http://your-server-url/get_quotations.php'; // PHP API URL to fetch quotations

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setQuotations(data.quotations); // Assuming the response has a 'quotations' array
        } else {
          console.error("Failed to fetch quotations.");
        }
      })
      .catch((error) => {
        console.error('Error fetching quotations:', error);
      });
  }, []);

  // Handle delete quotation
  const handleDelete = (quotationId) => {
    const url = `http://your-server-url/delete_quotation.php`; // API endpoint to delete a quotation

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: quotationId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setQuotations(quotations.filter((quotation) => quotation.id !== quotationId));
          alert('Quotation deleted successfully!');
        } else {
          alert('Failed to delete quotation.');
        }
      })
      .catch((error) => {
        console.error('Error deleting quotation:', error);
        alert('An error occurred while deleting the quotation.');
      });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Saved Quotations</h2>
        {quotations.length === 0 ? (
          <p>No quotations saved yet.</p>
        ) : (
          <ul className="space-y-4">
            {quotations.map((quotation, index) => (
              <li key={index} className="border border-gray-300 p-4 rounded flex justify-between">
                <div>
                  <h3 className="font-semibold">Ref. No: {quotation.referenceNo}</h3>
                  <p>Name: {quotation.name}</p>
                  <p>Address: {quotation.address}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/view-quotation/${quotation.id}`} // Link to the detail view
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(quotation.id)} // Trigger delete
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/edit-quotation/${quotation.id}`} // Link to the edit view
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuotationsList;