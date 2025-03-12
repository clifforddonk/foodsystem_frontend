"use client";
import React, { useState } from "react";
import axios from "axios";
import { X, User } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminLoginModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");

  // Handle admin modal input changes
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      // Validate admin credentials against environment variables
      const response = await axios.post("/api/admin/verify", adminCredentials);

      if (response.data.success) {
        // Reset form and close modal
        setAdminCredentials({ username: "", password: "" });
        onClose();

        // Navigate to admin page
        router.push("/admin");
      } else {
        setAuthError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setAuthError("Authentication failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
          <button
            onClick={() => {
              onClose();
              setAdminCredentials({ username: "", password: "" });
              setAuthError("");
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-5">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {authError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{authError}</span>
              </div>
            )}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                <User size={16} className="inline mr-1" /> Username
              </label>
              <input
                name="username"
                type="text"
                value={adminCredentials.username}
                onChange={handleAdminInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin username"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={adminCredentials.password}
                onChange={handleAdminInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#493711] hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors mt-4"
            >
              {/* Login */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
