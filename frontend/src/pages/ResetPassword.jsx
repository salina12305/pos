import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../services/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
    // --- Hooks & Routing ---
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Extract the 'token' from the URL (e.g., /reset-password?token=abc123...)
  const token = searchParams.get("token");
  
  // --- Local State ---
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Submission Handler
  const handleReset = async (e) => {
    e.preventDefault();
    // 1. Client-side Validation: Ensure passwords match before hitting the API
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
        // 2. API Call: Send the token and new password to the backend
      const response = await resetPasswordApi({ token, password });
      if (response.data.success) {
        toast.success("Password reset successfully! Redirecting to login...");
        // 3. UX: Give the user time to read the success message before redirecting
        setTimeout(() => navigate("/"), 2000); // Go back to landing/login
      }
    } catch (error) {
        // 4. Error Handling: Show backend error message or a generic fallback
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-emerald-800">New Password</h2>
        {/* New Password Input */}
        <input 
          type="password" 
          placeholder="Enter new password" 
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        {/* Confirmation Input */}
        <input 
          type="password" 
          placeholder="Confirm new password" 
          className="w-full border p-3 rounded-lg mb-6"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
        {/* Submit Button with Loading State */}
        <button 
          disabled={loading}
          className="w-full bg-emerald-700 text-white py-3 rounded-full font-bold"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;