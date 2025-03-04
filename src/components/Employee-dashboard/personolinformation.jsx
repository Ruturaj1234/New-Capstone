import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUserAlt, FaRegBuilding, FaMapMarkerAlt, FaBirthdayCake, FaUniversity, FaEdit, FaLock } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalInformation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [detailsExist, setDetailsExist] = useState(true);
  const [editPersonalModal, setEditPersonalModal] = useState(false);
  const [editBankModal, setEditBankModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  // Personal info form state (for both edit and initial add)
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost/login-backend/get_user_info.php");
      const data = await response.json();
      if (data.success) {
        if (data.details_exist) {
          setPersonalInfo(data.employee);
          setDetailsExist(true);
          setName(data.employee.name);
          setAddress(data.employee.address || "");
          setDateOfBirth(data.employee.date_of_birth || "");
          setContactNumber(data.employee.contact_number || "");
          setEmail(data.employee.email || "");
          setAccountNumber(data.employee.account_number || "");
          setIfscCode(data.employee.ifsc_code || "");
        } else {
          setPersonalInfo({ eid: data.eid }); // Only eid for new user
          setDetailsExist(false);
        }
      } else {
        toast.error("Failed to fetch employee details: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Error fetching employee details: " + error.message);
    }
  };

  const handleAddDetails = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eid", personalInfo.eid);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("contact_number", contactNumber);
    formData.append("email", email);
    formData.append("account_number", accountNumber);
    formData.append("ifsc_code", ifscCode);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost/login-backend/addEmployeeDetails.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchUserInfo(); // Reload to show Personal Info page
      } else {
        toast.error("Failed to add details: " + data.message);
      }
    } catch (error) {
      console.error("Error adding details:", error);
      toast.error("Error adding details: " + error.message);
    }
  };

  const handleEditPersonal = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eid", personalInfo.eid);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("contact_number", contactNumber);
    formData.append("email", email);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost/login-backend/updateEmployeeDetails.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEditPersonalModal(false);
        setImage(null);
        fetchUserInfo();
      } else {
        toast.error("Failed to update personal details: " + data.message);
      }
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast.error("Error updating personal details: " + error.message);
    }
  };

  const handleEditBank = async (e) => {
    e.preventDefault();
    if (!personalInfo.eid || !accountNumber || !ifscCode) {
      toast.error("Missing required fields: " + 
        (!personalInfo.eid ? "Employee ID " : "") + 
        (!accountNumber ? "Account Number " : "") + 
        (!ifscCode ? "IFSC Code" : ""));
      return;
    }

    const payload = {
      eid: personalInfo.eid,
      account_number: accountNumber,
      ifsc_code: ifscCode,
    };
    try {
      const response = await fetch("http://localhost/login-backend/updateBankDetails.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setEditBankModal(false);
        fetchUserInfo();
      } else {
        toast.error("Failed to update bank details: " + data.message);
      }
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error("Error updating bank details: " + error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/login-backend/changePassword.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eid: personalInfo.eid,
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setChangePasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Failed to change password: " + data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password: " + error.message);
    }
  };

  if (!personalInfo) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // If details don't exist, show form to add them
  if (!detailsExist) {
    return (
      <div className="flex min-h-screen bg-gray-50">
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
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="text-gray-700 hover:text-orange-600 focus:outline-none lg:hidden mr-4"
              >
                <FaBars size={24} />
              </button>
              <img
                src="https://www.saisamarthpolytech.com/images/logo.png"
                alt="Sai Samarth Polytech"
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              Complete Your Profile
            </h1>
          </header>

          {/* Form Content */}
          <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Setup Your Personal Details
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Please fill in your details to continue.
              </p>
              <form onSubmit={handleAddDetails}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaUserAlt className="text-orange-500" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-500" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaBirthdayCake className="text-orange-500" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaUserAlt className="text-orange-500" />
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaUserAlt className="text-orange-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaUniversity className="text-orange-500" />
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaRegBuilding className="text-orange-500" />
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaUserAlt className="text-orange-500" />
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-full shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm font-semibold"
                >
                  Save Details
                </button>
              </form>
            </div>
          </main>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </div>
    );
  }

  // Normal Personal Information page if details exist
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none lg:hidden mr-4"
            >
              <FaBars size={24} />
            </button>
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto"
            />
          </div>
        </header>

        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center space-x-4">
            {personalInfo.image ? (
              <img
                src={`http://localhost/login-backend/${personalInfo.image}`}
                alt="Employee"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {personalInfo.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name}</h1>
              <p className="text-sm text-gray-500">Employee Profile</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm flex-1">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "personal"
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaUserAlt className="inline-block mr-2" />
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab("bank")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "bank"
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaRegBuilding className="inline-block mr-2" />
                  Bank Information
                </button>
              </div>
            </div>

            <div className="p-6 flex-1">
              {activeTab === "personal" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaUserAlt className="text-orange-500" />
                      <span className="font-medium">Full Name</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaBirthdayCake className="text-orange-500" />
                      <span className="font-medium">Date of Birth</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.date_of_birth || "N/A"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaUserAlt className="text-orange-500" />
                      <span className="font-medium">Contact Number</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.contact_number || "N/A"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaUserAlt className="text-orange-500" />
                      <span className="font-medium">Email</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.email || "N/A"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span className="font-medium">Address</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.address || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => setEditPersonalModal(true)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-orange-700 transition duration-200"
                    >
                      <FaEdit /> Edit Personal Info
                    </button>
                    <button
                      onClick={() => setChangePasswordModal(true)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-orange-700 transition duration-200"
                    >
                      <FaLock /> Change Password
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaUniversity className="text-orange-500" />
                      <span className="font-medium">Account Number</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.account_number || "N/A"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaRegBuilding className="text-orange-500" />
                      <span className="font-medium">IFSC Code</span>
                    </div>
                    <p className="mt-2 text-gray-900 font-medium pl-8">{personalInfo.ifsc_code || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                      onClick={() => setEditBankModal(true)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-orange-700 transition duration-200"
                    >
                      <FaEdit /> Edit Bank Info
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit Personal Info Modal */}
          {editPersonalModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Personal Information</h2>
                <form onSubmit={handleEditPersonal}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Contact Number</label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPersonalModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Bank Info Modal */}
          {editBankModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Bank Information</h2>
                <form onSubmit={handleEditBank}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditBankModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Change Password Modal */}
          {changePasswordModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setChangePasswordModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default PersonalInformation;