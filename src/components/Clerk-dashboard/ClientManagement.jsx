import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBars, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Step 1: State for search query
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch clients from the database
  const fetchClients = async () => {
    try {
      console.log("Fetching clients...");
      const response = await fetch('http://localhost/login-backend/get_clients.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data: ", data);

      if (data.success) {
        console.log("Fetched clients successfully:", data.clients);
        setClients(data.clients);
      } else {
        alert("Failed to fetch clients: " + data.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error fetching clients: " + error.message);
    }
  };

  // Add Client to the database
  const handleAddClient = async () => {
    if (clientName.trim()) {
      const formData = new FormData();
      formData.append('clientName', clientName);
  
      try {
        const response = await fetch('http://localhost/login-backend/store_project.php', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
  
        if (data.success) {
          alert(data.message);
          setClientName("");
          setShowAddClientModal(false);
          fetchClients();
        } else {
          alert("Failed to add client: " + data.message);
        }
      } catch (error) {
        console.error("Error adding client:", error);
      }
    } else {
      alert("Client name cannot be empty");
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);

  // Step 2: Filter clients based on the search query
  const filteredClients = clients.filter(client =>
    client.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`flex-1 p-6 bg-gray-100 ${isSidebarOpen ? "ml-64" : "ml-0"} transition-all`}>
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <button onClick={toggleSidebar} className="text-gray-700">
            <FaBars size={24} />
          </button>
          <div className="flex items-center flex-grow justify-center">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto"
            />
          </div>
          <button onClick={() => window.location.href = "/login"} className="text-gray-700">
            <FaSignOutAlt size={24} />
          </button>
        </header>

        <div className="flex justify-center mb-4 mt-4">
          <input
            type="text"
            placeholder="Search for clients..."
            value={searchQuery} // Step 3: Bind search input to searchQuery state
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
            className="border rounded-lg p-2 w-1/3"
          />
          <button
            onClick={() => setShowAddClientModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded ml-4"
          >
            <FaPlus className="mr-2" />
            Add Client
          </button>
        </div>

        <div className="overflow-y-auto max-h-60">
          {filteredClients.length > 0 ? ( // Display filtered clients
            filteredClients.map((client, index) => (
              <div key={index} className="bg-white p-4 mb-2 shadow rounded-lg flex justify-between items-center">
                <div onClick={() => navigate(`/projects/${client.id}`)} style={{ cursor: 'pointer' }}>
                  <span>{client.client_name}</span>
                  <span className="ml-2 text-sm text-gray-500">{client.created_at}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-4 mb-2 shadow rounded-lg">
              <span>No clients found.</span> {/* Update message for no clients found */}
            </div>
          )}
        </div>

        {showAddClientModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Client</h2>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="border rounded-lg p-2 w-full mb-4"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleAddClient}
                  className="bg-orange-600 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddClientModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
