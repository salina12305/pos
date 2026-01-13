

import React, { useState } from "react";
import toast from "react-hot-toast";
// import { forgotPasswordApi } from "../services/api"; // Ensure this is created in your api.js

const ForgotPw = ({ setOpen, openLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return toast.error("Please enter your email address");
    }

    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await forgotPasswordApi({ email });
      
      if (response.data.success) {
        toast.success("Reset link sent! Please check your inbox.");
        // Optional: Automatically take them back to login after sending
        setTimeout(() => {
          openLogin();
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-10 rounded-xl w-[450px] shadow-2xl relative animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
        >
          ×
        </button>

        <h2 className="text-center text-3xl font-semibold mb-6">
          Reset Password
        </h2>

        <p className="text-sm text-center text-gray-500 mb-8 px-4">
          Enter your email and we’ll send you password reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-3 rounded-full mt-2 font-medium transition shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm">
            Remember your password?{" "}
            <button 
              className="text-pink-600 font-semibold hover:underline" 
              onClick={openLogin}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPw;

