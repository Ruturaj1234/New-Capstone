import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewQuotation = () => {
  const { id } = useParams(); // Get the quotation ID from the URL
  const [quotation, setQuotation] = useState(null);

  useEffect(() => {
    // Fetch the selected quotation details from backend
    const url = `http://your-server-url/get_quotation.php?id=${id}`; // PHP API URL to fetch a specific quotation

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setQuotation(data.quotation); // Assuming the response has a 'quotation' object
        } else {
          console.error("Failed to fetch quotation.");
        }
      })
      .catch((error) => {
        console.error('Error fetching quotation:', error);
      });
  }, [id]);

  if (!quotation) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Quotation Details</h2>
        <h3 className="font-semibold">Ref. No: {quotation.referenceNo}</h3>
        <p>Name: {quotation.name}</p>
        <p>Address: {quotation.address}</p>
        <p>Subject: {quotation.subject}</p>
        <h4 className="mt-4 font-semibold">Products:</h4>
        <ul className="space-y-2">
          {quotation.products.map((product, index) => (
            <li key={index} className="border border-gray-300 p-2 rounded">
              <p>Product Name: {product.productName}</p>
              <p>Description: {product.description}</p>
              <p>Old PO: {product.oldPO}</p>
              <p>Qty: {product.qty}</p>
              <p>Unit: {product.unit}</p>
              <p>Rate: {product.rate}</p>
              <p>Amount: {product.amount}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewQuotation;