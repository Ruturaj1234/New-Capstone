import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  User,
  Lock,
  Pencil,
  Trash2,
  X,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import Sidebar from "../Sidebar";
import { FaBars } from "react-icons/fa";

const ManageUser = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Toggle password visibility
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState({
    employees: [],
    clerks: [],
  });

  const roles = [
    { value: "clerk", label: "Clerk" },
    { value: "employee", label: "Employee" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const employeeRes = await fetch(
          "http://localhost/login-backend/Owner-management/view_employees.php"
        );
        const employeeData = await employeeRes.json();

        const clerkRes = await fetch(
          "http://localhost/login-backend/Owner-management/view_clerks.php"
        );
        const clerkData = await clerkRes.json();

        setUsers({
          employees: employeeData,
          clerks: clerkData,
        });
      } catch (error) {
        setMessage({ type: "error", content: "Failed to fetch users." });
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setIsFormVisible(true);
    setEditingUser(null);
    setFormData({ username: "", password: "", role: "" });
    setMessage({ type: "", content: "" });
    setIsPasswordVisible(false); // Reset visibility
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password, // Prefill password
      role: user.role,
    });
    setIsFormVisible(true);
    setIsPasswordVisible(false); // Start with hidden password
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingUser(null);
    setFormData({ username: "", password: "", role: "" });
    setMessage({ type: "", content: "" });
    setIsPasswordVisible(false);
  };

  const handleDelete = async (userId, role) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          "http://localhost/login-backend/Owner-management/delete_user.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ id: userId }),
          }
        );
        const result = await response.json();

        if (result.success) {
          setUsers((prev) => ({
            ...prev,
            [role + "s"]: prev[role + "s"].filter((user) => user.id !== userId),
          }));
          setMessage({
            type: "success",
            content: "User deleted successfully!",
          });
        } else {
          setMessage({ type: "error", content: "Failed to delete user" });
        }
      } catch (error) {
        setMessage({ type: "error", content: "Failed to delete user" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingUser
        ? "http://localhost/login-backend/Owner-management/edit_user.php"
        : "http://localhost/login-backend/Owner-management/generate_user.php";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          id: editingUser ? editingUser.id : "",
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });
      const result = await response.json();

      if (result.success || result.message) {
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
        handleCloseForm();
      } else {
        setMessage({
          type: "error",
          content: "An error occurred while saving the user.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", content: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const UserList = ({ users, title }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
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
                <td className="px-6 py-4 whitespace-nowrap">****</td>
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
        <div className="flex">
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <main className="flex-1">
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

            <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-8">
              <header>
                <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>
                <p className="text-gray-600">
                  Welcome to the management dashboard. Here you can efficiently
                  manage users, including employees and clerks, to ensure smooth
                  operations within the company.
                </p>
              </header>

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

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveView("employees")}
                  className={`px-6 py-3 rounded-lg text-sm font-medium ${
                    activeView === "employees"
                      ? "bg-orange-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  View Employees
                </button>
                <button
                  onClick={() => setActiveView("clerks")}
                  className={`px-6 py-3 rounded-lg text-sm font-medium ${
activeView === "clerks"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  View Clerks
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>

              {activeView === "employees" && (
                <UserList users={users.employees} title="Employee List" />
              )}
              {activeView === "clerks" && (
                <UserList users={users.clerks} title="Clerk List" />
              )}

              {/* User Form Modal */}
              {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                    <header className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">
                        {editingUser ? "Edit User" : "Add New User"}
                      </h2>
                      <button
                        onClick={handleCloseForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Username
                        </label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                          required
                          className="mt-1 p-3 border border-gray-300 rounded-md w-full"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-600">
                          Password
                        </label>
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          required={!editingUser} // Only required for new users
                          className="mt-1 p-3 border border-gray-300 rounded-md w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                          className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Role
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          required
                          className="mt-1 p-3 border border-gray-300 rounded-md w-full"
                        >
                          <option value="">Select role</option>
                          {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {message.content && (
                        <div
                          className={`p-3 rounded-md text-sm ${
                            message.type === "error"
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {message.content}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
                      >
                        {isLoading
                          ? "Saving..."
                          : editingUser
                          ? "Update User"
                          : "Create User"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ManageUser;