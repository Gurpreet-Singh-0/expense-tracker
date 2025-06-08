"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { updateProfile, deleteUser } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteUserData } from "../../utils/deleteUserData";
import Card  from "../../components/UI/Card"; 
import { Spinner } from "./components/Spinner";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    currency: "USD",
    theme: "light",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        currency: localStorage.getItem("currency") || "USD",
        theme: theme,
      });
    }
  }, [user, theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "theme") {
      setTheme(value);
    }
    
    if (name === "currency") {
      localStorage.setItem("currency", value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
        });
      }

      localStorage.setItem("currency", formData.currency);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setLoading(true);

    try {
      if (!user || !auth.currentUser) {
        throw new Error("No authenticated user found");
      }

      await deleteUserData(user.uid);
      await deleteUser(auth.currentUser);
      
      localStorage.removeItem("currency");
      localStorage.removeItem("theme");
      
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6  text-black">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900  :text-white mb-6 tracking-tight">
        Account Settings
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Profile Information" className="border border-gray-200  :border-gray-700">
          <div className="space-y-5">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium   : text-black mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300  :border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  :bg-gray-700  :text-white transition duration-150"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium    mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="block w-full px-4 py-2.5 border border-gray-300  rounded-lg shadow-sm bg-gray-100    cursor-not-allowed transition duration-150"
              />
              <p className="mt-2 text-sm ">
                Contact support if you need to change your email address
              </p>
            </div>
          </div>
        </Card>
        
        <Card title="Preferences" className="border border-gray-200  ">
          <div className="space-y-5">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700   mb-2">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300  rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  :bg-gray-700  :text-white transition duration-150"
              >
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="INR">Indian Rupee (₹)</option>
              </select>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Spinner className="h-5 w-5 mr-2 text-white" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </form>
      
      <Card title="Account Actions" className="mt-8 border border-red-200  :border-red-900/50">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900   mb-2">Sign Out</h3>
            <p className="text-sm text-gray-500   mb-4">
              Sign out of your account on this device
            </p>
            <button
              onClick={logout}
              className="px-5 py-2.5 border border-gray-300  rounded-lg text-gray-700   hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
          
          <div className="border-t border-gray-200  pt-6">
            <h3 className="text-lg font-medium text-red-600   mb-2">Delete Account</h3>
            <p className="text-sm text-gray-500   mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className={`px-5 py-2.5 border border-transparent rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}