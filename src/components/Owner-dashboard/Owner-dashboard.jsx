/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  User,
  Lock,
  UserCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";

const OwnerDashboard = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState(null); // 'employees' or 'clerks'
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - replace with actual API calls
  const [users, setUsers] = useState({
    employees: [
      { id: 1, username: "emp1", password: "****", role: "employee" },
      { id: 2, username: "emp2", password: "****", role: "employee" },
    ],
    clerks: [
      { id: 3, username: "clerk1", password: "****", role: "clerk" },
      { id: 4, username: "clerk2", password: "****", role: "clerk" },
    ],
  });

  const roles = [
    { value: "clerk", label: "Clerk" },
    { value: "employee", label: "Employee" },
  ];

  const handleManageClick = () => {
    setIsFormVisible((prev) => !prev);
    setActiveView(null);
    setEditingUser(null);
    if (isFormVisible) {
      setFormData({ username: "", password: "", role: "" });
      setMessage({ type: "", content: "" });
    }
  };

  const handleViewClick = (view) => {
    setActiveView(view);
    setIsFormVisible(false);
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "",
      role: user.role,
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (userId, role) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Replace with actual API call
        // await fetch(`http://localhost/api/users/${userId}`, { method: 'DELETE' });

        // Update local state
        setUsers((prev) => ({
          ...prev,
          [role + "s"]: prev[role + "s"].filter((user) => user.id !== userId),
        }));
        setMessage({ type: "success", content: "User deleted successfully!" });
      } catch (error) {
        setMessage({ type: "error", content: "Failed to delete user" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with actual API call
      // const response = await fetch('http://localhost/api/users', {
      //   method: editingUser ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulating successful API call
      const newUser = {
        id: editingUser?.id || Date.now(),
        ...formData,
      };

      setUsers((prev) => ({
        ...prev,
        [formData.role + "s"]: editingUser
          ? prev[formData.role + "s"].map((user) =>
              user.id === editingUser.id ? newUser : user
            )
          : [...prev[formData.role + "s"], newUser],
      }));

      setMessage({
        type: "success",
        content: `User ${editingUser ? "updated" : "created"} successfully!`,
      });
      setFormData({ username: "", password: "", role: "" });
      setEditingUser(null);
    } catch (error) {
      setMessage({
        type: "error",
        content: "An error occurred: " + error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const UserList = ({ users, title }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.password}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.role)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          onManageClick={handleManageClick}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <header>
              <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>
              <p className="text-gray-600">
                Manage employees and clerks effectively with this dashboard.
              </p>
            </header>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {users.employees.length + users.clerks.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-gray-500 text-sm font-medium">
                  Active Clerks
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {users.clerks.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-gray-500 text-sm font-medium">
                  Active Employees
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {users.employees.length}
                </p>
              </div>
            </div>

            
            {/* View Toggles */}
            <div className="flex gap-4">
              <button
                onClick={() => handleViewClick("employees")}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === "employees"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                View Employees
              </button>
              <button
                onClick={() => handleViewClick("clerks")}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === "clerks"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                View Clerks
              </button>
            </div>

            {/* Conditional User List */}
            {activeView === "employees" && (
              <UserList users={users.employees} title="Employee List" />
            )}
            {activeView === "clerks" && (
              <UserList users={users.clerks} title="Clerk List" />
            )}

            {/* Form */}
            {isFormVisible && (
              <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 space-y-6">
                <header className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {editingUser ? "Edit User" : "Generate New Credentials"}
                  </h2>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      required
                    >
                      <option value="">Select role</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white rounded-lg py-3 font-medium hover:bg-orange-700 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Generate Credentials"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;