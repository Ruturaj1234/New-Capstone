import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBars, FaEdit, FaTrashAlt, FaEllipsisV } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost/login-backend/get_clients.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setClients(data.clients);
      } else {
        toast.error("Failed to fetch clients: " + data.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("Error fetching clients: " + error.message);
    }
  };

  const handleAddClient = async () => {
    if (clientName.trim()) {
      const url = editingClient
        ? "http://localhost/login-backend/editClient.php"
        : "http://localhost/login-backend/store_project.php";
      const method = editingClient ? "POST" : "POST";
      const body = editingClient
        ? JSON.stringify({ id: editingClient.id, client_name: clientName })
        : new FormData();

      if (!editingClient) {
        body.append("clientName", clientName);
      }

      try {
        const response = await fetch(url, {
          method,
          headers: editingClient ? { "Content-Type": "application/json" } : {},
          body,
        });
        const data = await response.json();

        if (data.success) {
          toast.success(data.message);
          setClientName("");
          setShowAddClientModal(false);
          setEditingClient(null);
          fetchClients();
        } else {
          toast.error("Failed to " + (editingClient ? "update" : "add") + " client: " + data.message);
        }
      } catch (error) {
        console.error("Error " + (editingClient ? "updating" : "adding") + " client:", error);
        toast.error("Error " + (editingClient ? "updating" : "adding") + " client: " + error.message);
      }
    } else {
      toast.warning("Client name cannot be empty");
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientName(client.client_name);
    setShowAddClientModal(true);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const response = await fetch("http://localhost/login-backend/deleteClient.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: clientId }),
        });
        const data = await response.json();

        if (data.success) {
          toast.success(data.message);
          fetchClients();
        } else {
          toast.error("Failed to delete client: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Error deleting client: " + error.message);
      }
    }
  };

  const toggleDropdown = (clientId) => {
    setSelectedClientId(selectedClientId === clientId ? null : clientId);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
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

        <main className="flex-1 flex flex-col items-center p-4 sm:p-6 overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-6 text-center">
            Client Management
          </h2>

          <div className="flex flex-col sm:flex-row justify-center mb-6 w-full gap-4 sm:gap-6 px-2">
            <input
              type="text"
              placeholder="Search for clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full sm:max-w-md text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
            <button
              onClick={() => setShowAddClientModal(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center justify-center text-sm shadow-md hover:bg-orange-700 transition duration-200"
            >
              <FaPlus className="mr-2" />
              Add Client
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-2">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative"
                  onClick={() => navigate(`/projects/${client.id}`)}
                >
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {client.client_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Created at: {client.created_at}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(client.id);
                      }}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      <FaEllipsisV />
                    </button>

                    {selectedClientId === client.id && (
                      <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg p-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClient(client);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FaTrashAlt className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-6 shadow-lg rounded-lg text-center">
                <span className="text-lg text-gray-500">No clients found.</span>
              </div>
            )}
          </div>

          {showAddClientModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-2">
              <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-6">
                  {editingClient ? "Edit Client" : "Add New Client"}
                </h2>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name"
                  className="border border-gray-300 rounded-lg p-3 w-full mb-6 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <div className="flex justify-between">
                  <button
                    onClick={handleAddClient}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg text-sm shadow-md hover:bg-orange-700 transition duration-200"
                  >
                    {editingClient ? "Update" : "Add"}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddClientModal(false);
                      setEditingClient(null);
                      setClientName("");
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm shadow-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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

export default ClientManagement;