
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { loginUserApi } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const PostifyLogin = ({ setOpen, openRegister, openForgotPw }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            return toast.error("Please fill in all fields");
        }

        try {
            const response = await loginUserApi(formData);
            console.log("Backend Response:", response.data);
            
            if (response.status === 200 || response.status === 201) {
                const token = response.data.token;
        
                if (!token) {
                  return toast.error("Login worked, but no token was received.");
                }
                localStorage.setItem("token_postify", token);

                if (response.data.user  && response.data.user.id) {
                    localStorage.setItem("userId", response.data.user.id);
                }
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success(response.data.message || "Login successful!");
                let decoded;
                try {
                    decoded = jwtDecode(token);
                    console.log("Decoded Token Data:", decoded);
                } catch (tokenError) {
                  console.error("JWT Decode Error:", tokenError);
                  return toast.error("Token format is invalid.");
                }
                setTimeout(() => {
                    navigate("/userdashboard"); 
                }, 2000);
            } else {
                toast.error(response.data.message || "Login failed!");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Internal Server Error";
            toast.error(errorMessage);
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white p-10 rounded-xl w-[450px] shadow-2xl relative animate-fadeIn">
                
                {/* Close Button */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black transition-colors"
                >
                    ×
                </button>

                <h2 className="text-center text-3xl font-semibold mb-8">Welcome back</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Email Input */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative flex flex-col">
                        <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {!showPassword ? (
                                    <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        
                        {/* Forgot Password Link */}
                        <div className="text-right mt-2">
                            <button 
                                type="button"
                                onClick={openForgotPw} 
                                className="text-xs text-emerald-600 font-medium hover:underline cursor-pointer"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="bg-black text-white font-medium py-3 rounded-full mt-2 hover:bg-gray-800 transition shadow-lg active:scale-95"
                    >
                        Sign In
                    </button>
                </form>

                {/* Switch to Register */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        No account?{" "}
                        <button 
                            type="button"
                            className="text-emerald-600 font-semibold hover:underline"
                            onClick={openRegister}
                        >
                            Create one
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PostifyLogin;