// Media.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Media = () => {
  const { clientId, projectId } = useParams();
  const navigate = useNavigate();

  const [mediaData, setMediaData] = useState({
    image: null,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMediaData({ ...mediaData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setMediaData({ ...mediaData, image: e.target.files[0] });
  };

  const handleSaveMedia = () => {
    if (!mediaData.image) {
      alert("Please upload an image.");
      return;
    }
    // Logic to save or display media can be added here
    alert("Media details saved successfully!");
    // Reset form
    setMediaData({
      image: null,
      description: "",
    });
    navigate(-1); // Navigate back to ProjectDetail
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <header className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-700">
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold mx-auto">Media</h2>
        </header>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Project ID: <span className="text-gray-600">{projectId}</span>
          </h3>
          <h4 className="text-lg text-gray-500">Client ID: {clientId}</h4>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <h4 className="text-lg font-semibold mb-2">Media Details</h4>
          <form className="flex flex-col space-y-4">
            <label>
              Image:
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={mediaData.description}
                onChange={handleInputChange}
                placeholder="Enter media description"
                className="border border-gray-300 rounded p-2 w-full"
              />
            </label>
            <button
              type="button"
              onClick={handleSaveMedia}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Media
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Media;